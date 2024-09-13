"use client";

import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { debounce } from "throttle-debounce";
import invokeBot from "./bot";

/**
 * Home Component
 * 
 * This component 
 * 1. renders a signature pad that captures user input,
 * 2. processes the strokes, converts them to text,
 * 3. calls openai with the recognized text
 * 4. displays the response just below the written input
 */
export default function Home() {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const debounceRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize OffscreenCanvas for efficient rendering
    offscreenCanvasRef.current = new OffscreenCanvas(canvas.width, canvas.height);

    // Initialize SignaturePad for capturing strokes
    signaturePadRef.current = new SignaturePad(canvas);

    // Event listeners
    window.addEventListener("resize", handleResizeCanvas);
    signaturePadRef.current.addEventListener("endStroke", handleStrokeEnd);

    // Prevent default touch behaviors to ensure smooth drawing
    canvas.addEventListener("touchstart", preventDefaultTouch, { passive: false });
    canvas.addEventListener("touchmove", preventDefaultTouch, { passive: false });
    canvas.addEventListener("touchend", preventDefaultTouch, { passive: false });

    // Initial canvas setup
    handleResizeCanvas();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleResizeCanvas);
      signaturePadRef.current.removeEventListener("endStroke", handleStrokeEnd);

      canvas.removeEventListener("touchstart", preventDefaultTouch);
      canvas.removeEventListener("touchmove", preventDefaultTouch);
      canvas.removeEventListener("touchend", preventDefaultTouch);
    };
  }, []);

  /**
   * Prevents the default behavior for touch events.
   * @param {TouchEvent} event - The touch event to prevent default.
   */
  const preventDefaultTouch = (event) => {
    event.preventDefault();
  };

  /**
   * Handles the resizing of the canvas to ensure high-resolution rendering.
   */
  const handleResizeCanvas = () => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    if (!canvas || !offscreenCanvas) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    offscreenCanvas.width = canvas.offsetWidth * ratio;
    offscreenCanvas.height = canvas.offsetHeight * ratio;

    const context = canvas.getContext("2d");
    context.scale(ratio, ratio);
    signaturePadRef.current.clear();
  };

  /**
   * Handles the end of a stroke drawn on the signature pad.
   * Initiates debounce to process the input after a delay.
   */
  const handleStrokeEnd = () => {
    if (debounceRef.current) {
      debounceRef.current.cancel();
    }

    // Debounce the input processing by 2000ms
    debounceRef.current = debounce(2000, () => processStrokes(signaturePadRef.current.toData()));
    debounceRef.current();
  };

  /**
   * Processes the captured strokes by sending them to Google's Handwriting API
   * and invoking the bot with the recognized text.
   * @param {Array} strokes - The array of stroke data from SignaturePad.
   */
  const processStrokes = async (strokes) => {
    const inkData = convertStrokesToInkData(strokes);

    const requestBody = JSON.stringify({
      options: "enable_pre_space",
      requests: [
        {
          writing_guide: {
            writing_area_width: 1024,
            writing_area_height: 1024,
          },
          ink: inkData,
          language: "en",
        },
      ],
    });

    try {
      const response = await fetch(
        "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
        {
          method: "POST",
          body: requestBody,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        console.error("Error fetching handwriting data:", response);
        return;
      }

      const responseData = await response.json();
      const recognizedText = responseData[1][0][1][0];

      // Invoke the bot with the recognized text
      const botMessage = await invokeBot(recognizedText);

      // Draw the bot's response on the canvas
      renderTextOnCanvas(botMessage, strokes);
    } catch (error) {
      console.error("Error processing strokes:", error);
    }
  };

  /**
   * Converts stroke data from SignaturePad to the format required by Google's API.
   * @param {Array} strokes - The array of stroke data.
   * @returns {Array} - The formatted ink data.
   */
  const convertStrokesToInkData = (strokes) => {
    return strokes.map((stroke) => {
      const xCoordinates = stroke.points.map((point) => point.x);
      const yCoordinates = stroke.points.map((point) => point.y);
      return [xCoordinates, yCoordinates, []];
    });
  };

  /**
   * Renders the recognized text on the canvas below the user's strokes.
   * @param {string} text - The text to render.
   * @param {Array} strokes - The array of stroke data for positioning.
   */
  const renderTextOnCanvas = (text, strokes) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.font = "55px cursive";
    context.fillStyle = "#000"; // Set text color

    // Determine the maximum Y position from the strokes to position the text below
    const maxY = strokes.reduce((max, stroke) => {
      const strokeMaxY = stroke.points.reduce((sMax, point) => Math.max(sMax, point.y), 0);
      return Math.max(max, strokeMaxY);
    }, 0);

    // Define text wrapping parameters
    const paddingX = 50;
    const paddingY = 55;
    const maxWidth = canvas.offsetWidth - paddingX * 2;
    const lineHeight = 55;

    // Wrap and draw the text
    wrapText(context, text, paddingX, maxY + paddingY, maxWidth, lineHeight);

    // Fade out the text after 3 seconds
    setTimeout(() => fadeOutAndClearCanvas(context, canvas), 3000);
  };

  /**
   * Fades out the canvas content and clears it after the fade-out effect.
   * @param {CanvasRenderingContext2D} context - The canvas rendering context.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   */
  const fadeOutAndClearCanvas = (context, canvas) => {
    let opacity = 1.0; // Initial opacity
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const offscreenCanvas = offscreenCanvasRef.current;
    const offscreenContext = offscreenCanvas.getContext("2d");

    // Restore the offscreen canvas and clear previous drawings
    offscreenContext.restore();
    offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenContext.drawImage(canvas, 0, 0);

    // Reset transformations
    context.setTransform(1, 0, 0, 1, 0, 0);

    // Interval to gradually decrease opacity
    const fadeInterval = setInterval(() => {
      opacity -= 0.05;
      console.log(`Current opacity: ${opacity.toFixed(2)}`);

      signaturePadRef.current.clear();
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for redrawing

      context.globalAlpha = opacity; // Set current opacity
      context.drawImage(offscreenCanvas, 0, 0);

      if (opacity <= 0) {
        clearInterval(fadeInterval); // Stop fading
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        context.globalAlpha = 1.0; // Reset opacity
        context.scale(ratio, ratio); // Restore scaling
      }
    }, 100); // Fade step interval (milliseconds)
  };

  /**
   * Wraps and draws text on the canvas within the specified width.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {string} text - The text to wrap and draw.
   * @param {number} x - The x-coordinate for the text.
   * @param {number} y - The y-coordinate for the text.
   * @param {number} maxWidth - The maximum width for each line of text.
   * @param {number} lineHeight - The height of each line of text.
   */
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (const word of words) {
      const testLine = `${line}${word} `;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && line !== "") {
        lines.push(line.trim());
        line = `${word} `;
      } else {
        line = testLine;
      }
    }

    lines.push(line.trim()); // Add the last line

    // Draw each line of text
    lines.forEach((lineText, index) => {
      ctx.fillText(lineText, x, y + index * lineHeight);
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          background: "#f3dfc1",
          userSelect: "none",
        }}
      />
    </div>
  );
}