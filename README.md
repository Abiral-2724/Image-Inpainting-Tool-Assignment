# Image Inpainting Widget 🖌️🖼️

## Overview
Image Inpainting Widget is a powerful React-based web application that allows users to interactively mask and prepare images for inpainting. This tool provides an intuitive interface for uploading images, creating masks, and downloading processed images.

## Features ✨
- 📤 Drag and Drop Image Upload
- 🖌️ Interactive Mask Creation
- 🎛️ Adjustable Brush Size
- 🖼️ Real-time Image and Mask Preview
- 📥 Image Download Functionality

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Abiral-2724/Image-Inpainting-Tool-Assignment.git
   cd Image-Inpainting-Tool-Assignment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application
Start the development server:
```bash
npm run dev
```

## Building for Production
Create a production build:
```bash
npm run build
```

## Project Dependencies
### Main Dependencies
- React
- React DOM
- React Canvas Draw
- Lucide React
- Radix UI Components
- Tailwind CSS

### Development Dependencies
- Vite
- ESLint
- Tailwind CSS

## Usage
1. Upload an image via drag and drop or file upload
2. Use the brush to create a mask over areas you want to modify
3. Adjust brush size using the slider
4. Generate mask image
5. Download original or masked images

## Challenges and Solutions 🧩

During the development of the Image Inpainting Widget, several significant challenges were encountered and successfully addressed:

### 1. Complex Canvas Interaction
**Challenge:** Implementing an intuitive and responsive drawing mechanism for mask creation was technically complex. The primary difficulty was managing real-time canvas interactions while maintaining performance and user experience.

**Solution:** 
- Utilized `react-canvas-draw`, a powerful library that provides fine-grained control over canvas drawing.
- Implemented debounce and throttling techniques to optimize performance during mask creation.
- Created custom brush size controls to give users precise control over their masking process.

### 2. State Management for Image Processing
**Challenge:** Managing the state of uploaded images, masks, and processed images while ensuring smooth user interactions required careful architectural design.

**Solution:**
- Employed React's `useState` and `useEffect` hooks to create a robust state management system.
- Implemented a modular component structure that separates concerns between image upload, mask creation, and download functionalities.
- Used context providers to share state across different components efficiently.


## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact
Abiral Jain - [GitHub Profile](https://github.com/Abiral-2724)

Project Link: [https://github.com/Abiral-2724/Image-Inpainting-Tool-Assignment](https://github.com/Abiral-2724/Image-Inpainting-Tool-Assignment)

---
Made with ❤️ by Abiral Jain
