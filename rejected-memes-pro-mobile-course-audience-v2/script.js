const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const header=$("#header");
window.addEventListener("scroll",()=>{
  header.classList.toggle("scrolled",window.scrollY>20);
},{passive:true});

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
},{threshold:.12});
$$(".reveal").forEach((el,i)=>{
  el.style.transitionDelay=(Math.min(i%5,4)*70)+"ms";
  observer.observe(el);
});

const sections=$$("main section[id]");
const navLinks=$$(".nav a");
const navObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
    }
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>navObserver.observe(s));

const nav=$(".nav");
$(".nav-toggle")?.addEventListener("click",()=>nav.classList.toggle("open"));
navLinks.forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const cursor=$(".cursor-glow");
window.addEventListener("pointermove",e=>{
  cursor.style.left=e.clientX+"px";
  cursor.style.top=e.clientY+"px";
},{passive:true});

$$(".magnetic").forEach(btn=>{
  btn.addEventListener("pointermove",e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.12;
    const y=(e.clientY-r.top-r.height/2)*.12;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener("pointerleave",()=>btn.style.transform="");
});

const counters=$$("[data-count]");
const countObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target, target=Number(el.dataset.count);
    const duration=1300, start=performance.now();
    const tick=now=>{
      const p=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-p,3);
      const value=Math.round(target*eased);
      el.textContent=target===26?value+"M":value.toLocaleString("en-US");
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
},{threshold:.6});
counters.forEach(c=>countObserver.observe(c));

// Scroll-linked polish: subtle section depth and hero parallax.
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector(".hero-visual");
const heroCopy = document.querySelector(".hero-copy");
let ticking = false;

function updateScrollMotion(){
  const y = window.scrollY || 0;
  if(hero){
    const limit = Math.min(y, 520);
    hero.style.setProperty("--spot-y", `${20 + limit * .035}%`);
    if(heroVisual && window.innerWidth > 780){
      heroVisual.style.transform = `translate3d(0, ${limit * .035}px, 0)`;
    }
    if(heroCopy && window.innerWidth > 780){
      heroCopy.style.transform = `translate3d(0, ${limit * .018}px, 0)`;
    }
  }
  ticking = false;
}
window.addEventListener("scroll",()=>{
  if(!ticking){ requestAnimationFrame(updateScrollMotion); ticking=true; }
},{passive:true});
updateScrollMotion();

// Stagger each visible group naturally, without making the page feel mechanical.
const groups = [
  ".numbers-grid .number",
  ".story-rail .story-item",
  ".service-grid .service-card",
  ".course-list .course-row",
  ".quotes .quote"
];
groups.forEach(selector=>{
  document.querySelectorAll(selector).forEach((el,i)=>{
    el.style.transitionDelay = `${Math.min(i,5)*90}ms`;
  });
});

// Subtle 3D tilt for the visual cards. Disabled on touch devices.
if (window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".service-card, .quote").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `translateY(-5px) perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}


// Review archive modal: keep the homepage clean, reveal the full proof set on demand.
const reviewsModal = document.getElementById("reviewsModal");
const reviewMore = document.querySelector(".review-more");
const reviewCloseEls = document.querySelectorAll("[data-close-reviews]");
let lastFocusedReviewTrigger = null;

function openReviews(){
  if(!reviewsModal) return;
  lastFocusedReviewTrigger = document.activeElement;
  reviewsModal.hidden = false;
  reviewsModal.setAttribute("aria-hidden","false");
  document.body.classList.add("reviews-open");
  requestAnimationFrame(()=>reviewsModal.querySelector(".reviews-close")?.focus());
}
function closeReviews(){
  if(!reviewsModal) return;
  reviewsModal.hidden = true;
  reviewsModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("reviews-open");
  lastFocusedReviewTrigger?.focus?.();
}
reviewMore?.addEventListener("click", openReviews);
reviewCloseEls.forEach(el=>el.addEventListener("click", closeReviews));
window.addEventListener("keydown",e=>{
  if(e.key === "Escape" && reviewsModal && !reviewsModal.hidden) closeReviews();
});
