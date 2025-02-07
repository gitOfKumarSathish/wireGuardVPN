import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { ISourceOptions } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim'; // Ensures smooth performance

const ParticlesBackground: React.FC = () => {
    const particlesInit = useCallback(async (engine: any) => {
        await loadSlim(engine); // Load the Slim Engine for better performance
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: {
                    color: "#1a1a2e", // Dark purple-blue background for a premium look
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab", // Enables line connection when hovering
                        },
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                    },
                    modes: {
                        grab: {
                            distance: 200, // Distance at which particles connect
                            links: {
                                opacity: 0.7, // Opacity of connection lines
                                color: "#ffffff",
                            },
                        },
                        push: {
                            quantity: 4,
                        },
                    },
                },
                particles: {
                    number: {
                        value: 80, // Adjust number of particles
                        density: {
                            enable: true,
                            value_area: 900,
                        },
                    },
                    color: {
                        value: ["#ff2e63", "#6a0572", "#1b9aaa", "#d9138a"], // Red, Purple, and Blue tones
                    },
                    shape: {
                        type: "circle",
                    },
                    opacity: {
                        value: 0.8,
                        random: false,
                    },
                    size: {
                        value: 6, // Larger particles for a more visible effect
                        random: true,
                        anim: {
                            enable: true,
                            speed: 3,
                            size_min: 2,
                            sync: false,
                        },
                    },
                    move: {
                        enable: true,
                        speed: 2, // Slow smooth movement
                        direction: "none",
                        random: true,
                        straight: false,
                        outModes: {
                            default: "out",
                        },
                        bounce: false,
                    },
                    links: {
                        enable: true, // Enable lines between particles
                        distance: 180, // Distance between connected particles
                        color: "#ffffff",
                        opacity: 0.3,
                        width: 1,
                    },
                },
                detectRetina: true,
            } as ISourceOptions}
        />
    );
};

export default ParticlesBackground;
