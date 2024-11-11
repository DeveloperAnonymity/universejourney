import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.169.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.169.0/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap';
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

/// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

camera.position.z = 5;
camera.position.y = 0;
camera.position.x = 0;

// Create a timeline for scroll-triggered animations
const timeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#container",
        start: "top top",
        end: () => `${window.innerHeight * 25}`,
        scrub: 1,
        pin: true
    }
});

const starsAndGalaxiesGroup = new THREE.Group();
scene.add(starsAndGalaxiesGroup);
starsAndGalaxiesGroup.scale.set(0, 0, 0);

// also hide (starsAndGalaxiesGroup) at the beginning
// Function 

// Function to add stages to the timeline
function createStages() {
    timeline.totalDuration(100);
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new TextGeometry('The Journey of the Universe\nby Yanfu', {
            font: font,
            size: 0.5,
            depth: 0.06,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.02,
            bevelSegments: 5,
        });

        // give the text emmissive color
        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xffe912,
            emissive: 0x000000,
            roughness: 0.5,
            metalness: 0.5
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        const light = new THREE.PointLight(0xffffff, 500);
        light.position.set(0, 0, 20);

        textGeometry.center(); // Center the text

        // combine text and light
        textMesh.add(light);

        // Add text to the scene
        scene.add(textMesh);

        // Create a light source for better visibility

        // Add an animation to scale down and fade out the text
        timeline.to(textMesh.scale, {
            x: 0, y: 0, z: 0, // Scale down to zero
            duration: 0.75, // Duration of the fade-out
            onStart: () => {
                showExplanation("", "Scroll to begin!");;
            }
        });

        // Stage 1: Beginning

        const singularity = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,       // White base color
                emissive: 0xffffff,    // Initial bright white emission
                emissiveIntensity: 1,  // Adjust for brightness
                transparent: true
            })
        );
        singularity.castShadow = false;
        singularity.receiveShadow = false;
        scene.add(singularity);
        const loader = new THREE.TextureLoader();

        singularity.scale.set(0, 0, 0);

        timeline.to(singularity.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.25
        });

        timeline.to(singularity.scale, {
            x: 1.1, y: 1.1, z: 1.1,
            duration: 1,
            onStart: () => showExplanation(`
            At the beginning, the universe was squished into an infinitely hot and dense point, 
            so small that you can't even see it with a microscope, called <i>The Singularity</i>.
            We don't know what happened before then, but this is where our journey begins.
            `, "Start of time"
            )
        });

        // Stage 2: Cosmic Inflation
        timeline.to(singularity.scale, {
            x: 48, y: 48, z: 48,
            duration: 1,
            onStart: () => showExplanation(`
            Suddenly, <i>The Singularity</i> started to grow bigger and bigger, like how you blow a balloon.
             This process is called <i>Cosmic Expansion</i>. 
             It grew so fast that the universe was over 1 billion billion trillion times bigger than 
             before in less than a second.
            `, "10^-43 to 10^-35 seconds", "0 to one hundreth of a billionth of a trillionth of a trillionth of a second"
            )
        });

        // now change singularity's colour so that it dies down to black and we shrink it to size 0
        timeline.to(singularity.material.color, {
            r: 0, g: 0, b: 0, // Change color to black
            duration: 0.25,
            onStart: () => showExplanation(`
                Think of a box of bouncing marbles. If the box is bigger, 
                then the marbles have more space to bounce. Now, imagine energy 
                as the marbles and the universe as the box. As the universe becomes bigger, 
                energy is less packed together, so the temperature becomes colder. 
                But it is still too hot for anything to form.
            `, "10^-35 to 10^-6 seconds")
        });

        // Animate emissive color
        timeline.to(singularity.material, {
            emissiveIntensity: 0, // Correct property for controlling emissive intensity
            duration: 0.75
        });

        timeline.to(singularity.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.1
        });

        // Stage 3: Formation of Neutrons, Protons, and Electrons

        const particlesGroup = new THREE.Group();

        particlesGroup.scale.set(0, 0, 0);

        // Create 10 protons, 10 neutrons, and 10 electrons
        const numParticles = 30;

        for (let i = 0; i < numParticles; i++) {
            const proton = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0x000000 })
            );
            const neutron = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0x000000 })
            );
            const electron = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0x000000 })
            );
            proton.position.set(
                (Math.random() - 0.5) * 20,  // Random X position
                (Math.random() - 0.5) * 20,  // Random Y position
                (Math.random() - 0.5) * 20   // Random Z position
            );
            neutron.position.set(
                (Math.random() - 0.5) * 20,  // Random X position
                (Math.random() - 0.5) * 20,  // Random Y position
                (Math.random() - 0.5) * 20   // Random Z position
            );
            electron.position.set(
                (Math.random() - 0.5) * 20,  // Random X position
                (Math.random() - 0.5) * 20,  // Random Y position
                (Math.random() - 0.5) * 20   // Random Z position
            );
            var group = new THREE.Group();
            group.add(proton);
            group.add(neutron);
            group.add(electron);
            particlesGroup.add(group);
        }


        // Add the particle group to the scene
        scene.add(particlesGroup);

        timeline.to(particlesGroup.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.25,
            onStart: () => showExplanation(`
                    Now, the universe is finally cool enough for some things to form. 
                    The first objects to form are protons, neutrons and electrons, 
                    which make up an atom. But it is still too hot for the atom to form!
                `, "10^-6 to 1 second")
        });

        // now timeline to the colour of each particle to be red, green or blue

        // Create Protons, Neutrons, and Electrons


        // Animation for particles
        timeline.to(particlesGroup.position, {
            x: 0, y: 0, z: 0,
            duration: 1,
            onStart: () => {
                // Random position movement with gsap
                var c = 0;
                var i = 0;
                particlesGroup.children.forEach(group => {
                    i = 0;
                    group.children.forEach(particle => {
                        i++;
                        if (i == 1) {
                            gsap.to(particle.material.color, {
                                r: 0, g: 0, b: 1,  // Blue color
                                duration: 0.5
                            });
                        } else if (i == 2) {
                            gsap.to(particle.material.color, {
                                r: 1, g: 0, b: 0,  // Red color
                                duration: 0.5
                            });
                        }
                        else {
                            gsap.to(particle.material.color, {
                                r: 0, g: 1, b: 0,  // Green color
                                duration: 0.5
                            });
                        }

                        gsap.to(particle.position, {
                            x: (Math.random() - 0.5) * 20,  // Random X position
                            y: (Math.random() - 0.5) * 20,  // Random Y position
                            z: (Math.random() - 0.5) * 20,  // Random Z position
                            repeat: -1,  // Infinite loop
                            yoyo: true,  // Make the animation go back and forth
                            duration: 3,
                            ease: "power1.inOut",
                            delay: c
                        });
                        c += Math.random() * 0.03;
                    });
                });
            }
        });

        // Step to animate the combination of particles into nuclei
        timeline.to(particlesGroup.children, {
            duration: 2,
            onStart: () => {
                // Loop through each group (representing a combination of proton, neutron, electron)
                particlesGroup.children.forEach(group => {
                    let proton = group.children[1]; // Red particle (proton)
                    let electron = group.children[0]; // Blue particle (electron)
                    let neutron = group.children[2]; // Green particle (neutron)

                    // Only animate protons and electrons to combine into a grey particle
                    var meetX = (proton.position.x + neutron.position.x) / 2;
                    var meetY = (proton.position.y + neutron.position.y) / 2;
                    var meetZ = (proton.position.z + neutron.position.z) / 2;
                    gsap.to(proton.position, {
                        x: meetX, y: meetY, z: meetZ,  // Move proton to the center
                        duration: 2,
                        onStart: () => showExplanation(`
                            The temperature is now low enough for the first nuclei to form. 
                            Think of protons, neutrons and electrons as lego blocks. 
                            A nucleus is the lego structure formed when you place at least one 
                            proton block (optionally with some more protons and neutrons) on
                            the base plate. 
                            `, "3 minutes to 20 minutes", "These particles will form atoms."),
                        ease: "power2.inOut"
                    });

                    gsap.to(neutron.position, {
                        x: meetX, y: meetY, z: meetZ,  // Move neutron to the center
                        duration: 2,
                        ease: "power2.inOut",
                        onComplete: () => {
                            gsap.killTweensOf(neutron.position); // Stop the random movement
                            // Now another random movement

                            // Change color to grey when close enough
                            gsap.to([proton.material.color, neutron.material.color], {
                                r: 0.5, g: 0.5, b: 0.5, // Transition to grey
                                duration: 0.5,
                                onComplete: () => {
                                    gsap.to(neutron.position, {
                                        x: (Math.random() - 0.5) * 20,  // Random X position
                                        y: (Math.random() - 0.5) * 20,  // Random Y position
                                        z: (Math.random() - 0.5) * 20,  // Random Z position
                                        repeat: -1,  // Infinite loop
                                        yoyo: true,  // Make the animation go back and forth
                                        duration: 3,
                                        ease: "power1.inOut"
                                    });
                                }
                            });

                            // Optionally scale down electron and proton to make them appear as one
                            gsap.to([proton.scale], {
                                x: 0, y: 0, z: 0,
                                duration: 0.5
                            });

                            // Scale up the neutron (if needed) to create a sense of combined particle
                            gsap.to(neutron.scale, {
                                x: 1.5, y: 1.5, z: 1.5,
                                duration: 0.5
                            });
                        }
                    });
                });
            }
        });

        // Stage 3.2: Formation of Atoms
        timeline.to(particlesGroup.children, {
            duration: 1,
            onStart: () => {
                showExplanation(`
                Now, the temperature is low enough for the first atoms to form. 
                Thinking of lego blocks again, an atom is what you get when you place an 
                electron lego block on a nucleus structure.
                `, "20 minutes to 380,000 years", "These particles will form atoms.");
                // Loop through each group (representing a combination of proton, neutron, electron)
                particlesGroup.children.forEach(group => {
                    let proton = group.children[1]; // Red particle (proton)
                    let electron = group.children[0]; // Blue particle (electron)
                    let neutron = group.children[2]; // Green particle (neutron)

                    gsap.killTweensOf(electron.position); // Stop the random movement
                    gsap.killTweensOf(neutron.position); // Stop the random movement

                    // Combine neutron and electron into a single particle
                    var meetX = (electron.position.x + neutron.position.x) / 2;
                    var meetY = (electron.position.y + neutron.position.y) / 2;
                    var meetZ = (electron.position.z + neutron.position.z) / 2;

                    gsap.to(electron.position, {
                        x: meetX, y: meetY, z: meetZ,  // Move electron to the center
                        duration: 2,
                        ease: "power2.inOut"
                    });

                    gsap.to(neutron.position, {
                        x: meetX, y: meetY, z: meetZ,  // Move neutron to the center
                        duration: 2,
                        ease: "power2.inOut",
                        onComplete: () => {
                            // Change color to grey when close enough
                            gsap.to([electron.material.color, neutron.material.color], {
                                r: 0.5, g: 0.5, b: 0.5, // Transition to grey
                                duration: 0.5,
                                onComplete: () => {
                                    // Optionally scale down electron and neutron to make them appear as one
                                    gsap.to([electron.scale], {
                                        x: 0, y: 0, z: 0,
                                        duration: 0.5
                                    });

                                    // now randomly move the neutron

                                    gsap.to(neutron.position, {
                                        x: (Math.random() - 0.5) * 20,  // Random X position
                                        y: (Math.random() - 0.5) * 20,  // Random Y position
                                        z: (Math.random() - 0.5) * 20,  // Random Z position
                                        repeat: -1,  // Infinite loop
                                        yoyo: true,  // Make the animation go back and forth
                                        duration: 3,
                                        ease: "power1.inOut"
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });

        timeline.to(particlesGroup.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.5
        });

        const cmbr = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0x000000
            })
        );

        cmbr.scale.set(0, 0, 0);
        // use the same texture as the singularity
        loader.load('cmbr.jpg', function (texture) {
            cmbr.material.map = texture;
            cmbr.material.needsUpdate = true;
        });
        scene.add(cmbr);

        timeline.to(cmbr.scale, {
            x: 45, y: 45, z: 45,
            duration: 0.25
        });

        timeline.to(cmbr.material.color, {
            r: 1, g: 1, b: 1,
            duration: 0.75
            ,
            onStart: () => showExplanation(`
                The universe is quite cool now. Because it isn’t that hot, and atoms don’t emit light, 
                the universe became transparent, without much light. The only light back then was in 
                the form of a thing called <i>Cosmic Microwave Background Radiation</i>, which we can see today! 
                This remains a very important evidence of the Big Bang.
            `, "380,000 years to 150 million years", "The universe is now transparent, and the only light is the Cosmic Background Radiation.")
        });

        timeline.to(cmbr.material.color, {
            r: 0, g: 0, b: 0,
            duration: 0.75,
            onStart: () => showExplanation(`
                Since it was very dark, this part of the universe was called the <i>Dark Ages</i>. But it was 
                also an age of change; gravity, which is the force that causes things to fall, caused atoms to 
                come together into heavy clumps. Eventually, these clumps of atoms…
            `, "380,000 years to 150 million years")
        });

        timeline.to(cmbr.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.25
        });

        generateStars(1750);
        generateGalaxy(3, 50, 30, 30);
        generateGalaxy(3, 50, 30, 30);
        generateGalaxy(3, 50, 30, 30);
        generateGalaxy(3, 50, 30, 30);

        timeline.to(starsAndGalaxiesGroup.children, {
            duration: 0.1,
            onStart: () => {
                starsAndGalaxiesGroup.children.forEach(star => {
                    var color = new THREE.Color(0xffffff).lerp(new THREE.Color(0x8e44ad), Math.random());
                    if (star.type === "mist") {
                        color = new THREE.Color(0x8e44ad);
                    }
                    star.material.color = color;
                }
                )
            }
        });

        // Stage 4: Formation of Stars and Galaxies
        timeline.to(starsAndGalaxiesGroup.scale, {
            x: 0.01, y: 0.01, z: 0.01,
            duration: 0.75,
            onStart: () => {
                showExplanation(`
                … formed stars and galaxies! These stars and galaxies are the building blocks of the 
                universe that we see today. They are made of the same atoms that were formed earlier, but 
                they crash together in the stars to make light. This light is what we see when we 
                look into the night sky.
            `, "150 million years to present")
            }
        });

        timeline.to(starsAndGalaxiesGroup.scale, {
            x: 0.01, y: 0.01, z: 0.01,
            duration: 0.5
        });

        // Now earth

        // now redshift

        // make all the stars and galaxies redder

        timeline.to(starsAndGalaxiesGroup.children, {
            duration: 1,
            onStart: () => {
                showExplanation(`
                As stars and galaxies move away from us, their light becomes redder than it really is. This is 
                called <i>Redshift</i>. The further away something is, the more red shifted it is. Most stars 
                and galaxies are redshifted, meaning that they are moving away from us, telling us that the 
                universe is still expanding. 
            `, "150 million years to present")
                starsAndGalaxiesGroup.children.forEach(star => {
                    gsap.to(star.material.color, {
                        r: 1, g: 0.5, b: 0.5, // Reddish color
                        duration: 1
                    });
                });
            }
        });

        /* Or maybe gravity will cause everything to come back together into another Singularity, 
        and that Singularity may explode again, creating another Big Bang. 
        This is called the Big Crunch and Big Bounce theory. */


        timeline.to(starsAndGalaxiesGroup.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.5,
            onStart: () => {
                showExplanation(`
                Maybe the universe will continue to expand forever. This theory is called the Big Rip theory.
            `, "The Future?");
            }
        });

        // Let's show singularity again
        const sing2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );
        sing2.scale.set(50, 50, 50);
        scene.add(sing2);
        timeline.to(sing2.scale, {
            x: 50, y: 50, z: 50,
            duration: 0.15,
        });

        timeline.to(sing2.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.5,
            onStart: () => {
                showExplanation(`
                Or maybe gravity will cause everything to come back together into another Singularity, and 
                that Singularity may explode again into a new universe. This is called the Big Crunch and 
                Big Bounce theory.
            `, "The Future?");
            }
        });

        timeline.to(sing2.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.25
        });

        timeline.to(sing2.scale, {
            x: 50, y: 50, z: 50,
            duration: 0.5
        });

        timeline.to(sing2.scale, {
            x: 50, y: 50, z: 50,
            duration: 1,
            onStart: () => {
                showExplanation(`
                Ultimately, we don't know what will happen in the future. But we do know that the universe
                has come a long way since the beginning. It has been a journey of change, growth, and
                discovery. And it is a journey that we are still on today.
                `, "The Present")
            }
        });

        // Now it's time for credits

        const creditGroup = new THREE.Group();

        creditGroup.scale.set(0, 0, 0);

        const creditGeometry = new TextGeometry(`
            The End
            `
            , {
                font: font,
                size: 0.5,
                depth: 0.06,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.02,
                bevelSegments: 5,
            });

        creditGeometry.center(); // Center the text

        const credits = new THREE.Mesh(creditGeometry, textMaterial);

        //Add light to the credits
        const Clight = new THREE.PointLight(0xffffff, 500);
        Clight.position.set(0, 0, 20);
        credits.add(Clight);

        creditGroup.add(credits);

        // Add text to the scene

        scene.add(creditGroup);

        timeline.to(creditGroup.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.25,
            onStart: () => showExplanation(`
                Thank you for joining me on this journey through the universe. <br>
                I hope you enjoyed the ride! <br>
                - Yanfu<br>
                (P.S. reload the page to start again)
            `, "The End")
        });

    });

    // now for the formation of stars and galaxies (my favourite part)

    // Additional stages can be added similarly...
}

// Function to show explanation
function showExplanation(text, time, tooltip = false) {
    const explanation = document.createElement('div');
    explanation.className = 'explanation';
    explanation.innerHTML = `<p> ${text}</p>`;
    explanation.style.position = 'fixed';
    explanation.style.bottom = '10px';
    explanation.style.left = '50%';
    explanation.style.transform = 'translateX(-50%)';
    explanation.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    explanation.style.color = '#fff';
    explanation.style.padding = '10px';
    explanation.style.borderRadius = '5px';

    // Remove existing explanation
    const existingExplanation = document.querySelector('.explanation');
    if (existingExplanation) {
        existingExplanation.remove();
    }

    document.body.appendChild(explanation);
    document.getElementById('time').innerHTML = time;
    if (tooltip) {
        document.getElementById('tooltip').style.display = 'block';
        document.getElementById('tooltip').innerHTML = tooltip;
    } else {
        document.getElementById('tooltip').style.display = 'none';
    }
}

const mistTexture = new THREE.TextureLoader().load('star.png'); // Replace with a texture URL or use a canvas

function generateStars(starCount) {
    const radius = 4000; // Radius of the sphere

    for (let i = 0; i < starCount; i++) {
        // Random radial distance within the sphere (0 to radius)
        const r = Math.random() * radius; // Random distance from center (not fixed to surface)

        // Random spherical coordinates (theta, phi) for a point inside the sphere
        const theta = Math.random() * Math.PI * 2; // Random azimuthal angle
        const phi = Math.acos(Math.random() * 2 - 1); // Random polar angle

        // Convert spherical coordinates to Cartesian coordinates
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        const color = new THREE.Color(0xffffff).lerp(new THREE.Color(0x8e44ad), Math.random());

        // Create sprite material for the star
        const material = new THREE.SpriteMaterial({
            map: mistTexture, // Use your star texture here (or a different one for stars)
            color: color, // White color for stars
            transparent: true,
            opacity: 0.8, // Opacity for the stars
            blending: THREE.AdditiveBlending, // Additive blending to make stars glow
        });

        // Create sprite and set its position
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        var scale = (Math.random() - 0.5) * 5 + 7.5;
        sprite.scale.set(scale, scale, 1); // Random scale for variety
        starsAndGalaxiesGroup.add(sprite);
    }
}


function generateGalaxy(armCount, starCountPerArm, spread, armThickness) {
    // Create the galaxy arms (stars)
    for (let arm = 0; arm < armCount; arm++) {
        const armOffset = (arm / armCount) * Math.PI * 2; // Offset for each arm

        for (let i = 0; i < starCountPerArm * 1; i++) { // Less mist particles than stars
            // Gradually decrease the density of mist as we move away from the center
            const radius = Math.pow((i / (starCountPerArm * 0.8)), 2) * (spread + 250); // Concentrate mist near the center with squared distance
            const angle = armOffset + i * 0.4; // Mist around the arm

            // Randomly spread the mist around the arms
            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * armThickness * 2;
            const y = (Math.random() - 0.5) * armThickness;
            const z = Math.sin(angle) * radius + (Math.random() - 0.5) * armThickness * 2;

            // Create sprite material
            const material = new THREE.SpriteMaterial({
                map: mistTexture,
                color: 0x8e44ad, // Purple mist color
                transparent: true,
                opacity: 0.4, // Soft opacity for misty effect
                blending: THREE.AdditiveBlending, // Makes the mist blend softly
            });

            // Create a sprite and position it
            const sprite = new THREE.Sprite(material);

            sprite.type = "mist";
            sprite.position.set(x, y, z);
            sprite.scale.set(Math.random() * 8 + 10, Math.random() * 8 + 10, 1); // Random scale for variety
            starsAndGalaxiesGroup.add(sprite);
        }

        // Now generate the stars
        for (let i = 0; i < starCountPerArm; i++) {
            const radius = i / starCountPerArm * 500; // Adjust radius scale as needed
            const angle = armOffset + i * 0.2; // Adjust angle increment for curvature
            const x = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
            const y = (Math.random() - 0.5) * spread * 0.3; // Vertical spread
            const z = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;

            // Star color gradient for visual variety
            const color = new THREE.Color(0xffffff).lerp(new THREE.Color(0x8e44ad), Math.random());
            const starMaterial = new THREE.SpriteMaterial({
                map: mistTexture,
                color: color,
                transparent: true,
                opacity: 0.9,
            });

            const starSprite = new THREE.Sprite(starMaterial);
            starSprite.position.set(x, y, z);
            var scale = (Math.random() - 0.5) * 5 + 7.5;
            starSprite.scale.set(scale, scale, 1); // Random scale for variety
            starsAndGalaxiesGroup.add(starSprite);
        }
    }
}

// Call function to set up stages
createStages();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;
//Disable movement 
controls.enablePan = false;


// Animation loop
function animate() {
    controls.update();
    starsAndGalaxiesGroup.rotation.y += 0.0005; // Slow rotation for dynamic effect
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
