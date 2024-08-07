import jsPDF from "jspdf";
import template from "./assets/Nametag.png?url";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const form = document.getElementById("nametag-form")! as HTMLFormElement;
const downpng = document.getElementById("downpng")! as HTMLButtonElement;
const downpdf = document.getElementById("downpdf")! as HTMLButtonElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await drawCanvas();
  canvas.scrollIntoView({
    behavior: "smooth",
  });
});

const getValue = (name: string): string => {
  const fullName = document.getElementsByName(name)[0] as HTMLInputElement;

  return fullName.value;
};

const drawTemplate = () => {
  return new Promise((r) => {
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      r(1);
    };
    image.src = template;
  });
};

const drawPhoto = (src: string) => {
  return new Promise((r) => {
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 122, 632);
      r(1);
    };
    image.src = src;
  });
};

const drawCanvas = async () => {
  const preview = document.getElementById("preview")! as HTMLImageElement;
  const img = preview.src;
  const fullName = getValue("fullName");
  const nickName = getValue("nickName");
  const department = getValue("department");
  const studyProgram = getValue("studyProgram");
  const element = getValue("element");
  await drawTemplate();
  if (img) {
    await drawPhoto(img);
  }

  const topTextX = 1205;
  const topTextY = 800;
  const topFont = "Bold 65px Times New Roman";

  const bottomTextX = 874;
  const bottomTextY = 1520;
  const bottomFont = "Bold 65px Times New Roman";

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = topFont;
  ctx.fillText(fullName, topTextX, topTextY);
  ctx.fillText(nickName, topTextX, topTextY + 345);

  ctx.font = bottomFont;
  ctx.fillText(department, bottomTextX, bottomTextY);
  ctx.fillText(studyProgram, bottomTextX, bottomTextY + 274);
  ctx.fillText(element, bottomTextX, bottomTextY + 276 * 2);
};

downpng.addEventListener("click", (e) => {
  e.preventDefault();
  var link = document.createElement("a");
  link.download = "NameTag.png";
  link.href = canvas.toDataURL();
  link.click();
});
downpdf.addEventListener("click", (e) => {
  e.preventDefault();
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [148, 210],
  });

  pdf.addImage(canvas, "JPEG", 0, 0, 148, 210);
  pdf.save("NameTag.pdf");
});
drawTemplate();
