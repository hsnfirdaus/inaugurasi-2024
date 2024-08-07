import Cropper from "cropperjs";

const cropper = document.getElementById("cropper")! as HTMLDivElement;
const image = document.getElementById("image")! as HTMLImageElement;
const input = document.getElementById("photo")! as HTMLInputElement;
const cancelcrop = document.getElementById("cancelcrop")! as HTMLButtonElement;
const cropbtn = document.getElementById("cropbtn")! as HTMLButtonElement;
const preview = document.getElementById("preview")! as HTMLImageElement;

input.addEventListener("change", (e) => {
  const files = (e.target as HTMLInputElement)?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (URL) {
      setImage(URL.createObjectURL(file));
    } else if (FileReader) {
      const reader = new FileReader();
      reader.onload = function () {
        if (reader.result) {
          setImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }
});
const setImage = (url: string) => {
  input.value = "";
  image.src = url;
  showModal();
};

var cropperjs: Cropper | null = null;
const showModal = () => {
  cropperjs = new Cropper(image, {
    aspectRatio: 4 / 6,
  });

  cropper.classList.remove("hidden");
  cropper.classList.add("block");
};

const hideModal = () => {
  cropper.classList.remove("block");
  cropper.classList.add("hidden");
  cropperjs?.destroy();
  cropperjs = null;
};

cancelcrop.addEventListener("click", (e) => {
  e.preventDefault();
  hideModal();
});

cropbtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!cropperjs) return;

  const canvas = getRoundedCanvas(cropperjs.getCroppedCanvas());
  const url = canvas.toDataURL("image/png", 1);
  preview.src = url;

  hideModal();
});

const drawRoundedCanvas = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const getRoundedCanvas = (sourceCanvas: HTMLCanvasElement) => {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d")!;
  const width = 450;
  const height = (6 / 4) * width;
  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = true;

  const radius = 40;
  drawRoundedCanvas(ctx, 0, 0, width, height, radius);
  ctx.clip();
  ctx.drawImage(sourceCanvas, 0, 0, width, height);
  drawRoundedCanvas(ctx, 0, 0, width, height, radius);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 15;
  ctx.stroke();
  return canvas;
};
