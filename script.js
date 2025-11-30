//Three.js Background animado
const canvas = document.getElementById("bg");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x10131a, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 6;

//Partículas como fondo dinámico
const particlesCount = 4000;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 14;      // x
  positions[i3 + 1] = (Math.random() - 0.5) * 8;   // y
  positions[i3 + 2] = (Math.random() - 0.5) * 14;  // z
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0x00ffee,
  size: 0.015,
  transparent: true,
  opacity: 0.95,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);
scene.add(new THREE.AmbientLight(0xffffff, 0.05));

//Animación de partículas rotando suavemente
let t = 0;
function animate() {
  t += 0.01;
  particles.rotation.y = Math.sin(t * 0.3) * 0.4;
  particles.rotation.x = Math.cos(t * 0.2) * 0.15;
  particles.position.z = Math.sin(t * 0.6) * 0.1;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

//Ajuste al cambiar tamaño de ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//Tooltip y detalle de eventos
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
document.body.appendChild(tooltip);

const detalle = document.getElementById("detalle");
const detalleTitle = document.getElementById("detalle-title");
const detalleText = document.getElementById("detalle-text");

//Eventos de hover y click sobre cada punto
document.querySelectorAll(".event").forEach((ev) => {
  //Mostrar tooltip al pasar el mouse
  ev.addEventListener("mouseenter", () => {
	tooltip.innerHTML = ev.dataset.hover;
	tooltip.classList.add("visible");
	const rect = ev.getBoundingClientRect();
	tooltip.style.left = rect.left + rect.width / 2 + "px";
	tooltip.style.top =
	  ev.classList.contains("top")
		? rect.top - tooltip.offsetHeight - 10
		: rect.bottom + 10 + "px";
  });

  //Ocultar tooltip al quitar el mouse
  ev.addEventListener("mouseleave", () => {
	tooltip.classList.remove("visible");
  });

  //Mostrar detalle expandido al hacer click
  ev.addEventListener("click", () => {
	const labelStrong = ev.nextElementSibling.querySelector("strong").textContent;
	detalleTitle.innerHTML = "Cómo han influido «" + labelStrong + "» en el desarrollo tecnológico";
	detalleText.innerHTML = ev.dataset.info;
	detalle.classList.add("visible");
	detalle.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
