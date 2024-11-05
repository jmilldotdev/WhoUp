"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../app/page.module.css";
import { GardenBackground } from "./GardenBackground";

export function MoonPhaseViewer() {
  const getTodaysMoonPhase = (): number => {
    const today = new Date();
    const new_moon = new Date(2000, 0, 6, 18, 14, 0); // Known new moon date
    const phase_diff =
      ((today.getTime() - new_moon.getTime()) / 86400000) % 29.530588853;

    return Math.floor(phase_diff * (28 / 29.530588853)) + 1;
  };

  const [currentDay, setCurrentDay] = useState(getTodaysMoonPhase());
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [holdDuration, setHoldDuration] = useState(0);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newPos = e.clientX - startX;
    const dayOffset = Math.floor(newPos / 100);
    // Remove the min/max constraints to allow infinite scrolling
    const newDay = currentDay + dayOffset;
    setCurrentDay(newDay);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNormalizedDay = (day: number): number => {
    // Convert any day number to a value between 1 and 28
    return ((day - 1 + 28000) % 28) + 1;
  };

  const getMoonPhaseStyle = (day: number): React.CSSProperties => {
    // Calculate the shortest distance considering the circular nature
    const normalizedCurrent = getNormalizedDay(currentDay);
    const normalizedDay = getNormalizedDay(day);
    let distance = Math.abs(normalizedCurrent - normalizedDay);
    distance = Math.min(distance, 28 - distance); // Get shortest path around the circle

    const scale = Math.max(1 - distance * 0.15, 0.5);
    const opacity = Math.max(1 - distance * 0.2, 0.2);

    const offset = (day - currentDay) * 100;

    return {
      transform: `translateX(${offset}px) scale(${scale})`,
      opacity,
      transition: "transform 0.3s, opacity 0.3s",
      position: "absolute" as const,
      left: "50%",
      marginLeft: "-25px",
    };
  };

  const handleMoonPhaseClick = (day: number) => {
    setCurrentDay(day);
  };

  const getDateDisplay = (day: number): string => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    // Calculate the date for the given moon phase day
    const moonDate = new Date();
    moonDate.setDate(moonDate.getDate() + (day - currentDate));

    if (moonDate.getDate() === currentDate) {
      return "Today";
    }

    return moonDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getFormattedDateTime = (): string => {
    const date = currentTime.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

    const time = currentTime.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${date} ${time}`;
  };

  const handleRockClick = () => {
    alert("You clicked the floating rock!"); // You can replace this with your desired message
  };

  const handleRockMouseDown = () => {
    setIsHolding(true);
    const timer = setInterval(() => {
      setHoldDuration((prev) => {
        const newDuration = prev + 0.1;
        if (newDuration >= 5) {
          clearInterval(timer);
          setFadeOut(true);
          // Delay the redirect to allow for fade animation
          setTimeout(() => {
            window.location.href = '/zengarden';
          }, 1000); // 1 second fade out
        }
        return newDuration;
      });
    }, 100);
    setHoldTimer(timer);
  };

  const handleRockMouseUp = () => {
    if (holdTimer) {
      clearInterval(holdTimer);
    }
    setIsHolding(false);
    setHoldDuration(0);
    setHoldTimer(null);
  };

  return (
    <>
      <GardenBackground />
      <div className={styles.page}>
        <div
          style={{
            position: "absolute",
            top: "20px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
            fontFamily: "monospace",
          }}
        >
          {getFormattedDateTime()}
        </div>

        <div
          className={styles.interactiveArea}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className={styles.rockContainer}>
            {isHolding && (
              <>
                {/* White background circle */}
                <div
                  style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '300px',
                    border: '4px solid white',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff',
                    filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))',
                  }}
                />
                {/* Red progress circle */}
                <svg
                  style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                    width: '300px',
                    height: '300px',
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.7))',
                  }}
                >
                  <circle
                    cx="150"
                    cy="150"
                    r="148"
                    stroke="#FE730A"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="929.91"
                    strokeDashoffset={929.91 * (1 - (holdDuration / 5))}
                    style={{
                      transition: 'stroke-dashoffset 0.1s linear',
                      filter: 'blur(1px)',
                    }}
                  />
                </svg>
              </>
            )}
            <Image
              className={styles.rock}
              src="/rock.png"
              alt="Floating rock"
              width={200}
              height={200}
              priority
              onMouseDown={handleRockMouseDown}
              onMouseUp={handleRockMouseUp}
              onMouseLeave={handleRockMouseUp}
              style={{ 
                cursor: "pointer", 
                position: 'relative', 
                zIndex: 1,
                animation: holdDuration >= 3 
                  ? `shake${Math.min(Math.floor((holdDuration - 3) * 2) + 1, 4)} 0.1s linear infinite`
                  : '',
              }}
            />
          </div>

          <div
            className={styles.moonPhaseScroller}
            style={{ marginTop: "-50px" }}
          >
            <div className={styles.moonPhaseContainer}>
              {/* Modify the array to show more phases before and after */}
              {Array.from({ length: 84 }, (_, i) => currentDay - 28 + i).map(
                (day) => (
                  <div
                    key={day}
                    className={`${styles.moonPhaseItem} ${day === currentDay ? styles.selected : ""}`}
                    style={getMoonPhaseStyle(day)}
                    onClick={() => handleMoonPhaseClick(day)}
                  >
                    {day === currentDay && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-25px",
                          width: "100%",
                          textAlign: "center",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {getDateDisplay(day)}
                      </div>
                    )}
                    <Image
                      src={`/moonphases/${getNormalizedDay(day + 14)}.png`}
                      alt={`Moon phase day ${getNormalizedDay(day + 14)}`}
                      width={50}
                      height={50}
                      priority
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* White overlay for fade transition */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          opacity: fadeOut ? 1 : 0,
          pointerEvents: fadeOut ? 'all' : 'none',
          transition: 'opacity 1s ease-in-out',
          zIndex: 9999,
        }}
      />
      <style jsx global>{`
        @keyframes shake1 {
          0% { transform: translate(1px, 0); }
          25% { transform: translate(-1px, 0); }
          50% { transform: translate(1px, 0); }
          75% { transform: translate(-1px, 0); }
          100% { transform: translate(1px, 0); }
        }
        @keyframes shake2 {
          0% { transform: translate(2px, 0); }
          25% { transform: translate(-2px, 0); }
          50% { transform: translate(2px, 0); }
          75% { transform: translate(-2px, 0); }
          100% { transform: translate(2px, 0); }
        }
        @keyframes shake3 {
          0% { transform: translate(3px, 0); }
          25% { transform: translate(-3px, 0); }
          50% { transform: translate(3px, 0); }
          75% { transform: translate(-3px, 0); }
          100% { transform: translate(3px, 0); }
        }
        @keyframes shake4 {
          0% { transform: translate(4px, 0); }
          25% { transform: translate(-4px, 0); }
          50% { transform: translate(4px, 0); }
          75% { transform: translate(-4px, 0); }
          100% { transform: translate(4px, 0); }
        }
      `}</style>
    </>
  );
}
