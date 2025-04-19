const RidzzStore = (function () {
    const elements = {
        filterButtons: document.querySelectorAll(".filter-btn"),
        footerFilterLinks: document.querySelectorAll("[data-filter]"),
        productItems: document.querySelectorAll(".product-item"),
        topupForm: document.getElementById("topupForm"),
        topupModal: new bootstrap.Modal(document.getElementById("topupModal")),
        successModal: new bootstrap.Modal(document.getElementById("successModal")),
        selectedProductText: document.getElementById("selectedProduct"),
        carousel: document.querySelector("#carouselExampleSlidesOnly")
    };

    let selectedProduct = "";
    let carouselInstance = null;

    const applyFilter = (filterName) => {
        // Update active button state
        elements.filterButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === filterName);
        });

        
        elements.productItems.forEach(item => {
            item.style.display = (filterName === "all" || item.dataset.game === filterName) 
                ? "block" 
                : "none";
        });

        
        if (carouselInstance) {
            carouselInstance.pause();
        }
    };

    
    const initEventListeners = () => {
        
        document.addEventListener("click", (e) => {
            const filterBtn = e.target.closest(".filter-btn");
            if (!filterBtn) return;

            e.preventDefault();
            e.stopPropagation();
            
        
            applyFilter(filterBtn.dataset.filter);
            
            
            if (filterBtn.closest(".carousel-item")) {
                document.querySelector("#game").scrollIntoView({
                    behavior: "smooth"
                });
            }
        });

        
        elements.footerFilterLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                applyFilter(link.dataset.filter);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });

      
        document.addEventListener("click", (e) => {
            const buyBtn = e.target.closest(".buy-btn");
            if (!buyBtn) return;

            e.preventDefault();
            
            const productCard = buyBtn.closest(".product-card") || 
                              buyBtn.closest(".d-flex");
            
            if (productCard) {
                const title = productCard.querySelector("p.mb-0, .product-title")?.textContent;
                const price = productCard.querySelector("span.d-block, .product-price")?.textContent;
                const game = productCard.closest(".col-sm-6")?.querySelector("h3.fs-5")?.textContent;
                
                selectedProduct = game 
                    ? `${game} - ${title} (${price})` 
                    : `${title} - ${price}`;
                
                elements.selectedProductText.textContent = `Produk: ${selectedProduct}`;
                elements.topupModal.show();
                
                
                if (carouselInstance) carouselInstance.pause();
            }
        });

        
        elements.topupForm?.addEventListener("submit", (e) => {
            e.preventDefault();
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value 
                                || "Tidak diketahui";
            
            elements.topupModal.hide();
            elements.successModal.show();
            e.target.reset();
            
            console.log(`Transaction: ${selectedProduct} | Method: ${paymentMethod}`);
        });

    
        if (elements.carousel) {
            // Initialize carousel
            carouselInstance = new bootstrap.Carousel(elements.carousel, {
                interval: 5000,
                pause: "hover",
                wrap: true
            });

          
            elements.carousel.addEventListener("mouseenter", () => {
                carouselInstance.pause();
            });

            
            elements.carousel.addEventListener("mouseleave", () => {
                carouselInstance.cycle();
            });
        }
    };

    
    return {
        init: () => {
            initEventListeners();
            applyFilter("all");
        }
    };
})();


document.addEventListener("DOMContentLoaded", () => RidzzStore.init());