import React, { useState, useRef, useCallback } from "react";
import CanvasDraw from "react-canvas-draw";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";
import { Upload, Scissors, Eraser, ImageIcon, Github, X, FileDown, Download } from 'lucide-react';

function ImageInpaintingWidget() {
  // State Management
  const [originalImage, setOriginalImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [brushRadius, setBrushRadius] = useState(10);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Image Processing Function
  const processImage = useCallback((file) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setMaskImage(null);
        if (canvasRef.current) {
          canvasRef.current.clear();
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Image Upload Handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  // Drop Image Handler
  const dropImage = () => {
    setOriginalImage(null);
    setMaskImage(null);
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate Mask Image
  const generateMaskImage = () => {
    if (canvasRef.current && originalImage) {
      const canvas = canvasRef.current.canvas.drawing;
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext("2d");

      // Fill with black background
      maskCtx.fillStyle = "black";
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Draw white mask over black background
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.drawImage(canvas, 0, 0);

      // Convert to data URL
      const maskDataUrl = maskCanvas.toDataURL("image/png");
      setMaskImage(maskDataUrl);
    }
  };

  // Download Image Function
  const downloadImage = (imageDataUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear Canvas
  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      setMaskImage(null);
    }
  };

  // Effect to add drag and drop event listeners
  React.useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);

      return () => {
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      };
    }
  }, [handleDragOver, handleDragLeave, handleDrop]);

  return (
    <div 
      ref={dropZoneRef}
      className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col"
    >
      <div className="max-w-13xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] flex-grow">
        <div className="p-8 relative">
          {/* Drop Image Button - Only show when an image is loaded */}
          {originalImage && (
            <button 
              onClick={dropImage}
              className="absolute top-4 right-4 z-10 bg-red-400 hover:bg-red-600 text-white p-2 rounded-full transition duration-300 group"
              title="Drop Image"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition duration-300" />
            </button>
          )}

          <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-8 animate-pulse">
            Image Inpainting Tool
          </h1>

          {/* Image Upload Input and Drag-Drop Zone */}
          <div className="mb-8 flex justify-center">
            <label
              htmlFor="file-upload"
              className={`flex items-center justify-center w-[90%] h-12 px-5 py-1.5 
                ${isDragging 
                  ? 'bg-blue-700 border-4 border-blue-300' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                } 
                text-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer group`}
            >
              {isDragging ? (
                <>
                  <FileDown className="mr-2 animate-bounce" />
                  <span className="font-extralight text-lg">Drop your image here</span>
                </>
              ) : (
                <>
                  <Upload className="mr-2 group-hover:animate-bounce" />
                  <span className="font-extralight text-lg">Upload or Drag & Drop Image</span>
                </>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Canvas Area */}
          {originalImage && (
            <div className="mb-8 flex flex-col items-center space-y-6">
              <div className="relative inline-block border-4 border-gray-700 rounded-xl shadow-md">
                <CanvasDraw
                  ref={canvasRef}
                  brushRadius={brushRadius}
                  brushColor="white"
                  imgSrc={originalImage}
                  canvasWidth={600}
                  canvasHeight={400}
                  hideGrid={true}
                  className="rounded-lg"
                />
              </div>

              {/* Brush Size Control */}
              <div className="w-full max-w-md">
                <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-xl">
                  <Scissors className="text-blue-700" />
                  <span className="font-medium text-blue-800">Brush Size:</span>
                  <Slider
                    defaultValue={[brushRadius]}
                    max={50}
                    min={1}
                    step={1}
                    onValueChange={(value) => setBrushRadius(value[0])}
                    className="relative flex items-center w-full h-4"
                  >
                    <Slider.Track className="bg-gray-700 rounded-full h-2 w-full">
                      <Slider.Range className="bg-blue-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md hover:scale-110 transition" />
                  </Slider>
                  <span className="text-sm text-blue-600 w-12 text-right">
                    {brushRadius} px
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={generateMaskImage} 
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transition duration-300"
                >
                  <ImageIcon className="mr-2" /> Generate Mask
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={clearCanvas}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition duration-300"
                >
                  <Eraser className="mr-2" /> Clear Canvas
                </Button>
              </div>
            </div>
          )}

          {/* Image Display */}
          {originalImage && maskImage && (
            <div className="flex flex-col items-center space-y-8 mt-8">
              <div className="flex justify-center space-x-8">
                <div className="text-center transform transition hover:scale-105">
                  <h2 className="text-xl font-semibold mb-4 text-blue-300">Original Image</h2>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-[600px] max-h-[400px] shadow-2xl rounded-xl"
                  />
                </div>
                <div className="text-center transform transition hover:scale-105">
                  <h2 className="text-xl font-semibold mb-4 text-indigo-300">Mask Image</h2>
                  <img
                    src={maskImage}
                    alt="Mask"
                    className="max-w-[600px] max-h-[400px] shadow-2xl rounded-xl"
                  />
                </div>
              </div>
              
              {/* Download Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={() => downloadImage(originalImage, 'original_image.png')}
                  className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 transition duration-300"
                >
                  <Download className="mr-2" /> Download Original Image
                </Button>
                <Button 
                  onClick={() => downloadImage(maskImage, 'mask_image.png')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition duration-300"
                >
                  <Download className="mr-2" /> Download Mask Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 py-4 text-center bg-gray-900 text-gray-300">
        <div className="container mx-auto flex justify-center items-center">
          <span className="mr-2">Made with ❤️ by</span>
          <a 
            href="https://github.com/Abiral-2724" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-blue-400 hover:text-blue-300 transition duration-300 flex items-center"
          >
            <Github className="mr-1" /> Abiral Jain
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ImageInpaintingWidget;