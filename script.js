'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// ///////////////////////////////////////////////
// Menu fade animation
//Passing arguments into event handler functions

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

// Passing an "argument" into a handler: That means setting the 'this' keyword explicitly to a hanlder function. The bind method creates a copy of the function is called, setting the 'this' keyword to the parameter that is introduced
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Smooth scrolling for buttons

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // Smooth scrolling: You specify an object to the 'scrollto' method
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  // Most modern way (Not supported in all the browsers)
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation with smooth scrolling
//Use event delegation, ataching the event in the parent element to perform the same action in any element

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); //This avoids the page scrolling to the #href in the anchor
  if (e.target.classList.contains('btn--show-modal')) {
    return;
  }
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// ////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  // Getting only the button element, no matter if you click on the 'span' inside the button
  const clicked = e.target.closest('.operations__tab');
  // Guard clause: Stop if nothing is clicked
  if (!clicked) return;
  // Remove active class from all the buttons and the content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // Add the active class to the clicked element
  clicked.classList.add('operations__tab--active');
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ///////////////////////////////////////////////////
// Sticky navigation

// Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // Root Margin adds a margin (can be negative) to the observed element to trigger the observer
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// //////////////////////////////////////////////////
// Revealing elements on scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(e => {
  //  TEMPORARYYY
  // e.classList.add('section--hidden');
  sectionObserver.observe(e);
});

// ///////////////////////////////////////////////////
// Lazy loading images:
// Images are heacy elements to download so, they slow the perfomance of a webpage. This functionality allows each image to be downloaded after the webpage is done

const imgTargets = document.querySelectorAll('img[data-src]');

console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace source attribute with the actual image
  entry.target.src = entry.target.dataset.src;

  // The load event is important in case the user has a really slow network, so the high-resolution image takes a long time to load and you don't want the unblur to happen before the image is done loading
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

// /////////////////////////////////////////////////
// Slider component

// Selecting all the html elements needed for the component
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

// Defining a variable to keep track of the current slide
let currentSlide = 0;

// slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`)); This became unnecesary once the goToSlide function was implemented

// Function to translate the slides elements
const goToSlide = function (slidenum) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slidenum)}%)`)
  );
};

// Initializing the components on slide 0
goToSlide(0);

// Functions to go to the next slide and previous slide
const nextSlide = function () {
  if (currentSlide === slides.length - 1) currentSlide = -1;
  currentSlide++;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
const prevSlide = function () {
  if (currentSlide === 0) currentSlide = slides.length;
  currentSlide--;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

// Creating the event listeners for the buttons
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Sliding using the left and right arrow keys
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  // Other option to avoid the 'if' is to use short circuiting
  e.key === 'ArrowRight' && nextSlide();
});

// Dotted slider
// Activating the dot according to the slide
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// Creating the dots initially
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide="${i}"></button>`
    );
  });
  activateDot(currentSlide);
};

createDots();

// Adding the functionality to click on the dots and go to that slide
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
