document.addEventListener('DOMContentLoaded',()=>{

  // Scroll progress
  const prog=document.getElementById("scroll-progress");
  window.addEventListener("scroll",()=>{prog.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100+"%";});

  // Back to Top
  const backBtn=document.getElementById("back-to-top");
  window.addEventListener("scroll",()=>{backBtn.style.display=window.scrollY>300?"block":"none";});
  backBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

  // Shrink navbar
  const nav=document.querySelector("nav");
  window.addEventListener("scroll",()=>{nav.classList.toggle("shrink",window.scrollY>40);});

  // Hero particles
  const canvas=document.getElementById("hero-canvas");
  if(canvas){
    const ctx=canvas.getContext("2d");
    let particles=[];
    function initParticles(){
      canvas.width=window.innerWidth;
      canvas.height=document.querySelector(".hero").offsetHeight;
      particles=[];
      for(let i=0;i<120;i++){particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5});}
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
        ctx.fillStyle="rgba(0,191,255,0.2)";
        ctx.fill();
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>canvas.width)p.vx*=-1;
        if(p.y<0||p.y>canvas.height)p.vy*=-1;
      });
      requestAnimationFrame(draw);
    }
    initParticles(); draw();
    window.addEventListener("resize",()=>{initParticles();});
  }

  // Scroll reveal
  const revealElements=document.querySelectorAll('.flip-card, .contact-section');
  function revealOnScroll(){
    const triggerBottom=window.innerHeight*0.85;
    revealElements.forEach(el=>{
      const box=el.getBoundingClientRect();
      if(box.top<triggerBottom){el.classList.add('visible');}
    });
  }
  window.addEventListener('scroll',revealOnScroll);
  revealOnScroll();

});
