//MENU HAMBURGUESA
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Abre y cierra el menú al hacer clic en la hamburguesa
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cierra el menú automáticamente cuando el usuario hace clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


// ==========================================================================
// CARRUSEL 1: RESEÑAS INFINITO - RENDER SEGURO SÓLIDO
// ==========================================================================
const trackReviews = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (trackReviews) {
    const originalCards = Array.from(trackReviews.querySelectorAll('.eames-card'));
    const totalRealSlides = originalCards.length;
    
    let currentIndex = 1; 
    let isTransitioning = false;
    let hasInteracted = false; 

    // Duplicación infinita de extremos
    const firstClone = originalCards[0].cloneNode(true);
    const lastClone = originalCards[totalRealSlides - 1].cloneNode(true);
    
    trackReviews.insertBefore(lastClone, originalCards[0]);
    trackReviews.appendChild(firstClone);

    function updateCarousel(withTransition = true) {
        const viewport = document.querySelector('.carousel-viewport');
        if (!viewport) return;

        // El ancho de la tarjeta es el ancho exacto del viewport
        const cardWidth = viewport.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(trackReviews).gap) || 0;

        const allRenderedCards = trackReviews.querySelectorAll('.eames-card');
        allRenderedCards.forEach((card) => {
            // Le restamos los 4px del padding del track y los 2px de sus propios bordes
            card.style.width = `${cardWidth - 6}px`; 
        });

        if (withTransition) {
            trackReviews.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        } else {
            trackReviews.style.transition = 'none';
        }

        // El movimiento ahora es limpio y exacto para todas las tarjetas
        const moveAmount = currentIndex * (cardWidth - 6 + gap);
        trackReviews.style.transform = `translateX(-${moveAmount}px)`;

        if (prevBtn) {
            if (!hasInteracted) {
                prevBtn.classList.add('is-hidden');
            } else {
                prevBtn.classList.remove('is-hidden');
            }
        }
    }

    trackReviews.addEventListener('transitionend', () => {
        isTransitioning = false;

        if (currentIndex === totalRealSlides + 1) {
            trackReviews.style.transition = 'none';
            currentIndex = 1;
            updateCarousel(false);
        }
        
        if (currentIndex === 0) {
            trackReviews.style.transition = 'none';
            currentIndex = totalRealSlides;
            updateCarousel(false);
        }
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            if (!hasInteracted) hasInteracted = true; 
            currentIndex++;
            updateCarousel(true);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            if (!hasInteracted) hasInteracted = true; 
            currentIndex--;
            updateCarousel(true);
        });
    }

    window.addEventListener('resize', () => {
        updateCarousel(false);
    });

    // ==========================================================================
    // AGREGADO: SOPORTE TÁCTIL (SWIPE) EN PANTALLAS MENORES A 768PX
    // ==========================================================================
    let touchStartX = 0;
    let touchEndX = 0;

    trackReviews.addEventListener('touchstart', (e) => {
        if (window.innerWidth >= 768) return; 
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackReviews.addEventListener('touchend', (e) => {
        if (window.innerWidth >= 768) return; 
        touchEndX = e.changedTouches[0].screenX;
        
        const swipeThreshold = 50; // Mínimo de píxeles arrastrados para activar el cambio
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance < -swipeThreshold) {
            if (nextBtn) nextBtn.click(); // Desliza a la izquierda -> Siguiente tarjeta
        } else if (swipeDistance > swipeThreshold) {
            if (prevBtn) prevBtn.click(); // Desliza a la derecha -> Tarjeta anterior
        }
    }, { passive: true });

    // Inicialización del carrusel
    updateCarousel(false);
}


// Acordeón FAQ 
document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.faq-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const currentItem = trigger.parentElement;
            currentItem.classList.toggle('active');
        });
    });
});

// SECCIÓN IMAGEN VIDEO
const visionWrapper = document.querySelector('.vision-image-wrapper');

if (visionWrapper) {
    const visionVideo = visionWrapper.querySelector('video');

    // 1. COMPORTAMIENTO PARA PANTALLAS GRANDES (Mouseover)
    const handleMouseEnter = () => {
        if (window.innerWidth >= 1024) {
            if (visionVideo) {
                visionVideo.loop = true; // <-- ACTIVAMOS EL LOOP EN PANTALLAS GRANDES
                visionVideo.play();
            }
            visionWrapper.classList.add('active');
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            if (visionVideo) visionVideo.pause();
            visionWrapper.classList.remove('active');
        }
    };

    visionWrapper.addEventListener('mouseenter', handleMouseEnter);
    visionWrapper.addEventListener('mouseleave', handleMouseLeave);


    // 2. COMPORTAMIENTO PARA PANTALLAS CHICAS (Scroll / Entrar en pantalla)
    const observerOptions = {
        root: null,
        threshold: 0.5 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (window.innerWidth < 1024) {
                if (entry.isIntersecting) {
                    if (visionVideo) {
                        visionVideo.loop = false; // <-- DESACTIVAMOS EL LOOP EN PANTALLAS CHICAS
                        visionVideo.currentTime = 0; 
                        visionVideo.play();
                    }
                    visionWrapper.classList.add('active');
                } else {
                    visionWrapper.classList.remove('active');
                    if (visionVideo) visionVideo.pause();
                }
            }
        });
    }, observerOptions);

    observer.observe(visionWrapper);

    // 3. DETECTAR CUANDO EL VIDEO TERMINA (Solo aplica si loop es false)
    if (visionVideo) {
        visionVideo.addEventListener('ended', () => {
            if (window.innerWidth < 1024) {
                visionWrapper.classList.remove('active');
            }
        });
    }
}

// ==========================================================================
// CARRUSEL 2: GALERÍA CÁPSULA (PIEZAS INTERVENIDAS)
// ==========================================================================
const itemsCapsula = [
  { src: 'imagenes/capsula1sinfondo.png', label: 'Silla Loma' },
  { src: 'imagenes/capsula3sinfondo.png', label: 'Sillón Aragem' },
  { src: 'imagenes/capsula5sinfondo2.png', label: 'Cómoda Nogal' },
  { src: 'imagenes/capsula2sinfondo.png', label: 'Silla Veta' },
  { src: 'imagenes/capsula4sinfondo.png', label: 'Mesa Nexo' },
];

let currentCapsula = 0;
const trackCapsula = document.getElementById('track');
const counterCapsula = document.getElementById('counter');

function getVisibleCapsula(center) {
  const n = itemsCapsula.length;
  return [
    (center - 2 + n) % n,
    (center - 1 + n) % n,
    center,
    (center + 1) % n,
    (center + 2) % n,
  ];
}

function renderCapsula() {
  if (!trackCapsula) return;
  const vis = getVisibleCapsula(currentCapsula);
  trackCapsula.innerHTML = '';

  vis.forEach((idx, pos) => {
    const card2 = document.createElement('div');
    let cls = 'card2 ';
    if (pos === 2) cls += 'active';
    else if (pos === 1 || pos === 3) cls += 'side';
    else cls += 'far-side';
    card2.className = cls;

    const img = document.createElement('img');
    img.src = itemsCapsula[idx].src;
    img.alt = itemsCapsula[idx].label;
    card2.appendChild(img);

    if (pos === 2) {
      const overlay = document.createElement('div');
      overlay.className = 'card2-overlay';
      overlay.innerHTML = `
        <span class="overlay-text">${itemsCapsula[idx].label}</span>
        <button class="overlay-btn" aria-label="Ver pieza">+</button>
      `;
      card2.appendChild(overlay);
    }

    if (pos !== 2) {
      card2.addEventListener('click', () => {
        const diff = pos - 2;
        currentCapsula = (currentCapsula + diff + itemsCapsula.length) % itemsCapsula.length;
        renderCapsula();
      });
    }

    trackCapsula.appendChild(card2);
  });

  if (counterCapsula) {
    const num = String(currentCapsula + 1).padStart(2, '0');
    counterCapsula.textContent = num;
  }
}

if (document.getElementById('prev')) {
    document.getElementById('prev').addEventListener('click', () => {
      currentCapsula = (currentCapsula - 1 + itemsCapsula.length) % itemsCapsula.length;
      renderCapsula();
    });
}

if (document.getElementById('next')) {
    document.getElementById('next').addEventListener('click', () => {
      currentCapsula = (currentCapsula + 1) % itemsCapsula.length;
      renderCapsula();
    });
}

// Inicializar carruseles al cargar la página
window.addEventListener('load', () => {
    updateCarousel();
    renderCapsula();
});

// SOPORTE TÁCTIL (SWIPE) PARA EL CARRUSEL CÁPSULA (Menores a 1024px)
if (trackCapsula) {
    let touchStartX = 0;
    let touchEndX = 0;

    // Captura el punto exacto donde el usuario apoya el dedo
    trackCapsula.addEventListener('touchstart', (e) => {
        if (window.innerWidth < 1024) {
            touchStartX = e.changedTouches[0].screenX;
        }
    }, { passive: true });

    // Captura el punto donde el usuario levanta el dedo
    trackCapsula.addEventListener('touchend', (e) => {
        if (window.innerWidth < 1024) {
            touchEndX = e.changedTouches[0].screenX;
            
            const distanciaMinima = 50; // Píxeles mínimos de arrastre para activar el pase
            const distanciaRecorrida = touchEndX - touchStartX;

            // Desliza el dedo hacia la izquierda -> Va hacia adelante (Siguiente)
            if (distanciaRecorrida < -distanciaMinima) {
                currentCapsula = (currentCapsula + 1) % itemsCapsula.length;
                renderCapsula();
            } 
            // Desliza el dedo hacia la derecha -> Va hacia atrás (Anterior)
            else if (distanciaRecorrida > distanciaMinima) {
                currentCapsula = (currentCapsula - 1 + itemsCapsula.length) % itemsCapsula.length;
                renderCapsula();
            }
        }
    }, { passive: true });
}

// FORMULARIO CONTACTO
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('custom-contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      // Captura de datos del formulario
      const formData = new FormData(this);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      // Aquí puedes realizar tu llamada fetch/AJAX para enviar los datos
      console.log('Datos listos para enviar:', data);

      // Ejemplo de feedback visual básico
      const submitButton = this.querySelector('.btn-submit');
      const originalText = submitButton.textContent;
      
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      setTimeout(() => {
        alert('Thank you! Your message has been sent successfully.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        contactForm.reset();
      }, 1500); 
    });
  }
});


//METODOLOGIA PAGINA DETALLE

function toggleCard(clickedCard) {
  const container = document.getElementById('fichero-container');
  
  // Si la tarjeta clickeada ya estaba activa, la cerramos
  if (clickedCard.classList.contains('active')) {
    clickedCard.classList.remove('active');
    container.classList.remove('has-active');
  } else {
    // Removemos la clase activa de cualquier otra tarjeta abierta
    const activeCard = container.querySelector('.fichero-card.active');
    if (activeCard) {
      activeCard.classList.remove('active');
    }
    
    // Activamos la tarjeta actual y el estado del contenedor padre
    clickedCard.classList.add('active');
    container.classList.add('has-active');
  }
}

// ENTORNO AISLADO PARA LAS ESPECIFICACIONES TÉCNICAS (Súper Seguro)
{
  // Detecta automáticamente las 2 columnas restantes (materiales y acabados)
  document.querySelectorAll('.tecnica-col').forEach(column => {
    column.addEventListener('click', () => {
      const targetId = column.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      
      const columnsContainer = column.parentElement; 
      const allPanels = document.querySelectorAll('.tecnica-panel');

      if (!targetPanel || !columnsContainer) return;

      const isAlreadyActive = column.classList.contains('active');

      // 1. Resetear todos los botones de esta sección
      columnsContainer.querySelectorAll('.tecnica-col').forEach(c => {
        c.classList.remove('active');
        const icon = c.querySelector('.tecnica-icon');
        if (icon) icon.textContent = '+';
      });
      
      // 2. Ocultar todos los paneles (.tecnica-panel)
      allPanels.forEach(p => {
        p.classList.remove('active');
      });

      columnsContainer.classList.remove('has-active');

      // 3. Activar solo si no estaba abierto antes
      if (!isAlreadyActive) {
        column.classList.add('active');
        const icon = column.querySelector('.tecnica-icon');
        if (icon) icon.textContent = '-';
        columnsContainer.classList.add('has-active');
        targetPanel.classList.add('active');
      }
    });
  });
}

// SECCION ACABADOS PAGINA DETALLE
// ENTORNO AISLADO PARA LA INTERACCIÓN DE ACABADOS
{
  document.querySelectorAll('.acabados-btn').forEach(button => {
    button.addEventListener('click', () => {
      const parentContainer = button.parentElement;
      const displayImage = document.getElementById('acabados-display-img');
      const newImageSrc = button.getAttribute('data-image');

      if (!parentContainer || !displayImage || !newImageSrc) return;

      // 1. Quitar estado activo a todas las palabras
      parentContainer.querySelectorAll('.acabados-btn').forEach(btn => {
        btn.classList.remove('active');
      });

      // 2. Asignar activo al elemento clickeado
      button.classList.add('active');

      // 3. Cambiar la imagen de la izquierda
      displayImage.src = newImageSrc;
    });
  });
}

//SECCION VIDEO PAGINA DETALLE
// ENTORNO AISLADO PARA VIDEO AUTOMÁTICO EN SCROLL
{
  const videoSection = document.querySelector('.video-full-section');
  const videoElement = document.querySelector('.video-full-element');

  // Solo se ejecuta si la sección y el video existen en la página actual
  if (videoSection && videoElement) {
    const options = {
      root: null,       // Evalúa respecto a la pantalla del navegador
      threshold: 0.4    // Arranca cuando el 40% de la sección ya es visible en pantalla
    };

    const handleVideoScroll = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Si el usuario está en la sección, le da Play
          videoElement.play().catch(error => {
            console.log("Autoplay protegido por el navegador:", error);
          });
        } else {
          // Si el usuario se va de la sección, se Pausa solo
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleVideoScroll, options);
    observer.observe(videoSection);
  }
}

//ANIMACION SECCION NUMEROS PAGINA DETALLE
// ENTORNO AISLADO PARA REVELADO SECUENCIAL DE ESTADÍSTICAS
// ENTORNO AISLADO PARA REVELADO SECUENCIAL DE ESTADÍSTICAS REPETITIVO
{
  const statsGrid = document.querySelector('.stats-grid');

  if (statsGrid) {
    const observerOptions = {
      root: null,
      threshold: 0.2 // Se activa cuando el 20% de la sección asoma en pantalla
    };

    const revealStats = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Cuando entra en pantalla, activa la animación lenta
          statsGrid.classList.add('reveal-active');
        } else {
          // CUANDO SE VA DE PANTALLA, QUITA LA CLASE PARA REINICIARLA
          statsGrid.classList.remove('reveal-active');
        }
      });
    };

    const statsObserver = new IntersectionObserver(revealStats, observerOptions);
    statsObserver.observe(statsGrid);
  }
}

//ANIMACION SECCION FRASE PAGINA DETALLE
// ENTORNO AISLADO PARA REVELADO REPETITIVO DE LA FRASE EDITORIAL
{
  const fraseSection = document.querySelector('.frase-section');

  if (fraseSection) {
    const observerOptions = {
      root: null,
      threshold: 0.2 // Se activa cuando el 20% de la frase asoma en pantalla
    };

    const handleFraseScroll = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Activa el deslizamiento paralelo al entrar
          fraseSection.classList.add('reveal-active');
        } else {
          // Limpia la clase al salir para que se vuelva a ejecutar en el próximo pase
          fraseSection.classList.remove('reveal-active');
        }
      });
    };

    const fraseObserver = new IntersectionObserver(handleFraseScroll, observerOptions);
    fraseObserver.observe(fraseSection);
  }
}

// CONTROL DE ALTURAS HOMOGÉNEAS EN FONDOS DE CARDS CURSOS
window.addEventListener('DOMContentLoaded', () => {
    const fondos = document.querySelectorAll('.card-front-content');
    
    if (fondos.length > 0) {
        function igualarAlturasCursos() {
            // 1. Limpiamos cualquier rastro de altura previo
            fondos.forEach(f => f.style.removeProperty('height'));

            // 2. Solo calculamos alturas iguales en pantallas mayores o iguales a 768px
            if (window.innerWidth >= 768) {
                const alturaMaxima = Math.max(...Array.from(fondos).map(f => f.offsetHeight));
                
                fondos.forEach(f => {
                    f.style.setProperty('height', `${alturaMaxima}px`, 'important');
                });
            }
        }

        igualarAlturasCursos();
        window.addEventListener('resize', igualarAlturasCursos);
    }
});

// CONTADOR DE PUNTOS PARA EL CARRUSEL DE CURSOS (Por Rangos de Scroll)
window.addEventListener('DOMContentLoaded', () => {
    const gridCursos = document.querySelector('.sec-unica .cards-grid-3col');
    const dots = document.querySelectorAll('.carousel-dots-container .carousel-dot');

    if (gridCursos && dots.length > 0) {
        
        function actualizarPuntosPorScroll() {
            if (window.innerWidth < 1024) {
                const scrollActual = gridCursos.scrollLeft;
                // Calculamos el total de píxeles scrolleables que tiene el contenedor
                const scrollMaximo = gridCursos.scrollWidth - gridCursos.clientWidth;

                let dotIndex = 0;

                // Si el carrusel casi no tiene scroll (pantallas muy anchas donde entra todo)
                if (scrollMaximo <= 10) {
                    // Forzamos a que marque el primer punto (Tarjeta 2, la de order: 1)
                    dotIndex = 0;
                } else {
                    // Dividimos el recorrido total del scroll en 3 zonas iguales
                    const tercioScroll = scrollMaximo / 3;

                    if (scrollActual < tercioScroll) {
                        dotIndex = 0; // Primer tercio -> Punto 1 (Tarjeta 2)
                    } else if (scrollActual >= tercioScroll && scrollActual < tercioScroll * 2) {
                        dotIndex = 1; // Segundo tercio -> Punto 2 (Tarjeta 1)
                    } else {
                        dotIndex = 2; // Último tercio -> Punto 3 (Tarjeta 3)
                    }
                }

                // Sincronizamos los puntos activos
                dots.forEach((dot, idx) => {
                    if (idx === dotIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }

        // Escuchamos el evento de scroll y cambios de pantalla
        gridCursos.addEventListener('scroll', actualizarPuntosPorScroll);
        window.addEventListener('resize', actualizarPuntosPorScroll);
        
        // Ejecutamos una vez al inicio
        actualizarPuntosPorScroll();
    }
});



    {
// --- MÓDULO INTERACTIVO DE MATERIALES (DRAG & DROP) ---
const materialsData = {
    "1": { nombre: "Roble", origen: "Europa, Asia y Norteamérica", caracteristica: "Alta durabilidad", uso: "Piezas robustas" },
    "2": { nombre: "Bronce", origen: "Mezcla de cobre y estaño", caracteristica: "Resistente a la corrosión", uso: "Herrajes" },
    "3": { nombre: "Nogal", origen: "Asia", caracteristica: "Fácil para tallar", uso: "Muebles de lujo y tallados" },
    "4": { nombre: "Ratán", origen: "Sudeste Asiático", caracteristica: "Flexible", uso: "Asientos" }
};

let currentActiveId = null;
let activeClone = null; // Guardará el clon global del elemento arrastrado

const draggables = document.querySelectorAll('.draggable-material');
const dropZone = document.getElementById('dropZone');
const holder = document.getElementById('placedMaterialHolder');
const cardsGrid = document.getElementById('specCardsGrid');
const cardValues = document.querySelectorAll('.card-value');

draggables.forEach(img => {
    img.addEventListener('pointerdown', onPointerDown);
});

function onPointerDown(e) {
    e.preventDefault(); // Cancela arrastres nativos no deseados
    
    const originalTarget = e.currentTarget;
    const materialId = originalTarget.closest('.material-slot').getAttribute('data-material');
    
    // Obtenemos las dimensiones geométricas reales de la imagen original en pantalla
    const rect = originalTarget.getBoundingClientRect();
    
    // 1. CREAMOS EL CLON GLOBAL: Lo inyectamos directo en el body para saltarnos tus pestañas
    activeClone = originalTarget.cloneNode(true);
    activeClone.classList.add('dragging');
    
    // Forzamos que mida exactamente lo mismo que el original
    activeClone.style.position = 'fixed';
    activeClone.style.width = `${rect.width}px`;
    activeClone.style.height = `${rect.height}px`;
    activeClone.style.pointerEvents = 'none'; // Clave: para que no tape los eventos debajo de él
    activeClone.style.zIndex = '99999';
    
    // Calculamos el centro de la imagen para que se pegue al mouse de forma perfecta
    const offsetX = rect.width / 2;
    const offsetY = rect.height / 2;
    
    // Posicionamos el clon e interactuamos con el DOM global
    moveAt(e.clientX, e.clientY);
    document.body.appendChild(activeClone);
    
    // Hacemos que el slot capture los movimientos del puntero actual
    originalTarget.setPointerCapture(e.pointerId);
    
    // -------------------------------------------------------------
    // CAMBIO 1: Cambiamos '0.4' por '0' para ocultar por completo el original
    // -------------------------------------------------------------
    originalTarget.style.opacity = '0';

    function moveAt(clientX, clientY) {
        if (!activeClone) return;
        activeClone.style.left = `${clientX - offsetX}px`;
        activeClone.style.top = `${clientY - offsetY}px`;
    }

    function onPointerMove(ev) {
        moveAt(ev.clientX, ev.clientY);
        
        // Verificación espacial limpia sobre la zona de drop (mesa)
        const zoneRect = dropZone.getBoundingClientRect();
        if (ev.clientX >= zoneRect.left && ev.clientX <= zoneRect.right &&
            ev.clientY >= zoneRect.top && ev.clientY <= zoneRect.bottom) {
            dropZone.classList.add('drag-over');
        } else {
            dropZone.classList.remove('drag-over');
        }
    }

    function onPointerUp(ev) {
        originalTarget.releasePointerCapture(ev.pointerId);
        originalTarget.removeEventListener('pointermove', onPointerMove);
        originalTarget.removeEventListener('pointerup', onPointerUp);
        
        // -------------------------------------------------------------
        // CAMBIO 2: Devolvemos la opacidad a '1' (vacío) para que vuelva a verse si se suelta afuera
        // -------------------------------------------------------------
        originalTarget.style.opacity = '';
        
        // Eliminamos el clon global de la pantalla de inmediato
        if (activeClone) {
            activeClone.remove();
            activeClone = null;
        }
        
        dropZone.classList.remove('drag-over');

        // Evaluamos si las coordenadas finales del puntero soltaron sobre la mesa
        const zoneRect = dropZone.getBoundingClientRect();
        if (ev.clientX >= zoneRect.left && ev.clientX <= zoneRect.right &&
            ev.clientY >= zoneRect.top && ev.clientY <= zoneRect.bottom) {
            
            if (currentActiveId !== materialId) {
                currentActiveId = materialId;
                triggerWorkspaceSequence(materialId, originalTarget.src);
            }
        }
    }

    originalTarget.addEventListener('pointermove', onPointerMove);
    originalTarget.addEventListener('pointerup', onPointerUp);
}

// Control de secuencias animadas de la mesa
function triggerWorkspaceSequence(id, src) {
    const instruction = document.getElementById('workspaceInstruction');
    if (instruction) {
        instruction.classList.add('hidden');
    }

    if (holder.children.length > 0) {
        holder.className = 'placed-material-holder';
        holder.classList.add('fade-out');
        cardsGrid.classList.remove('visible');
        
        setTimeout(() => {
            renderNewMaterial(id, src);
        }, 300); 
    } else {
        renderNewMaterial(id, src);
    }
}

function renderNewMaterial(id, src) {
    holder.innerHTML = `<img src="${src}" alt="Material activo">`;
    holder.className = 'placed-material-holder';
    
    void holder.offsetWidth; // Disparador de Reflow
    
    holder.classList.add('pop-in');
    
    setTimeout(() => {
        holder.classList.remove('pop-in');
        holder.classList.add('slide-left');
        
        setTimeout(() => {
            populateCards(id);
            cardsGrid.classList.add('visible');
        }, 350);
    }, 400);
}

function populateCards(id) {
    const data = materialsData[id];
    if (!data) return;
    
    cardValues.forEach(span => {
        const prop = span.getAttribute('data-prop');
        if (data[prop]) {
            span.textContent = data[prop];
        }
    });
}
    }


//HERRAMIENTAS MOBILE    
// CONTROL DE ACCIÓN POR CLICK PARA HOTSPOTS EN MÓVILES
window.addEventListener('DOMContentLoaded', () => {
    const hotspots = document.querySelectorAll('.hotspot');

    hotspots.forEach(hotspot => {
        const btn = hotspot.querySelector('.hotspot__button');
        
        if (btn) {
            btn.addEventListener('click', (e) => {
                // Solo actúa por click si estamos en pantallas menores a 480px
                if (window.innerWidth < 480) {
                    e.stopPropagation(); // Evita que interfiera con otros elementos

                    // Si el elemento ya estaba activo, lo cierra
                    if (hotspot.classList.contains('active')) {
                        hotspot.classList.remove('active');
                    } else {
                        // Cierra todos los demás hotspots abiertos para que no se amontone el texto
                        hotspots.forEach(h => h.classList.remove('active'));
                        // Abre el hotspot actual
                        hotspot.classList.add('active');
                    }
                }
            });
        }
    });

    // Si el usuario hace click en cualquier otra parte de la pantalla, se cierran las etiquetas
    document.addEventListener('click', () => {
        if (window.innerWidth < 480) {
            hotspots.forEach(h => h.classList.remove('active'));
        }
    });
});