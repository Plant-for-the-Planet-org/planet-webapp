import React from "react";
function UserProfleLoader() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <svg
                width="320"
                height="400"
                //   ariaLabelledby="loading-aria"
                preserveAspectRatio="none"
                viewBox="0 0 320 400"
            >
                <rect
                    width="100%"
                    height="100%"
                    fill='url("#fill")'
                    clipPath="url(#clip-path)"
                ></rect>
                <defs>
                    <clipPath id="clip-path">
                        <circle cx="160" cy="150" r="150"></circle>
                        <rect width="300" height="40" x="10" y="340" rx="0" ry="0"></rect>
                    </clipPath>
                    <linearGradient id="fill">
                        <stop offset="0.6" stopColor="#f3f3f3">
                            <animate
                                attributeName="offset"
                                dur="2s"
                                keyTimes="0; 0.25; 1"
                                repeatCount="indefinite"
                                values="-2; -2; 1"
                            ></animate>
                        </stop>
                        <stop offset="1.6" stopColor="#ecebeb">
                            <animate
                                attributeName="offset"
                                dur="2s"
                                keyTimes="0; 0.25; 1"
                                repeatCount="indefinite"
                                values="-1; -1; 2"
                            ></animate>
                        </stop>
                        <stop offset="2.6" stopColor="#f3f3f3">
                            <animate
                                attributeName="offset"
                                dur="2s"
                                keyTimes="0; 0.25; 1"
                                repeatCount="indefinite"
                                values="0; 0; 3"
                            ></animate>
                        </stop>
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}

export default UserProfleLoader;