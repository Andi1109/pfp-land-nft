import { useRef, useState, useEffect } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { GetTotalLands, GetMyTotalLands, useContractMethod } from "../hooks";
import LandDetail from "./LandDetail";
import MyLandDetail from "./MyLandDetail";
import LandRoyal from "./LandRoyal";
import collectionBordersJson from "../borders/CollectionBorders.json";
import collectionTitlesJson from "../borders/CollectionTitles.json";
import tierBordersJson from "../borders/TierBorders.json";
import LandModal from "./LandModal";
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";

export default function Map() {
  interface Land {
    x: number;
    y: number;
  }

  interface RoyalLand {
    x: number;
    y: number;
    src: string;
  }

  let initialFlag = true;
  let flagScale = true; // if true draw zoom
  let offsetX = 0; // X position of mouse pointer
  let offsetY = 0; // Y position of mouse pointer
  let countMul = 0; // count of zoomed

  let zoomX = 0; // X position of previous zoomed
  let zoomY = 0; // Y position of previous zoomed

  const [zoomed, setZoomed] = useState(false);
  const { account } = useEthers();
  const totalLands = GetTotalLands();
  const myTotalLands = GetMyTotalLands(account);
  const toast = useToast();
  const { state, send: claimLand } = useContractMethod("claimLand");

  const [totalLandsValue, setTotalLandsValue] = useState("");
  const [myTotalLandsValue, setMyTotalLandsValue] = useState("0");
  const [claimedLands, setClaimedLands] = useState<Land[]>([]);
  const [myClaimedLands, setMyClaimedLands] = useState<Land[]>([]);
  const [royalLands, setRoyalLands] = useState<RoyalLand[]>([]);

  const canvasRef = useRef(null);
  const selectedLandX = useRef(null);
  const selectedLandY = useRef(null);
  const isMobile = window.screen.width <= window.screen.height ? true : false;
  const canvasHeight = Math.round(
    isMobile ? window.innerWidth : window.innerHeight / (100 / 90)
  );
  const [canvasSize, setCanvasSize] = useState(canvasHeight);

  useEffect(() => {
    if (totalLands && totalLands.toString() !== totalLandsValue) {
      setTotalLandsValue(totalLands.toString());
    }
  }, [totalLands]);

  useEffect(() => {
    if (myTotalLands && myTotalLands.toString() !== myTotalLandsValue) {
      setMyTotalLandsValue(myTotalLands.toString());
    }
  }, [myTotalLands]);

  useEffect(() => {
    doPostTransaction(state);
  }, [state]);

  const doPostTransaction = (state: any) => {
    let msg = "";
    console.log(state);
    switch (state.status) {
      case "Success":
        msg =
          "Success. To see the latest information, please refresh your browser.";
        toast({
          description: msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        break;
      case "None":
        break;
      case "Mining":
        msg = "Processing...";
        toast({
          description: msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        break;
      case "Fail":
        msg = "Transaction failed";
        toast({
          description: msg,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        break;
      case "Exception":
        msg = "Your transaction is likely to be failed";
        toast({
          description: msg,
          status: "warning",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
        break;
    }
  };

  const updateSize = () => {
    const height = Math.round(
      isMobile ? window.innerWidth : window.innerHeight / (100 / 90)
    );
    setCanvasSize(height);
  };

  const appendRoyalLands = (newLand: RoyalLand) => {
    if (
      royalLands.filter(
        (e: any) =>
          e.x === newLand.x && e.y === newLand.y && e.src === newLand.src
      ).length === 0 &&
      newLand.x >= 0 &&
      newLand.y >= 0 &&
      newLand.src
    ) {
      setRoyalLands(royalLands.concat(newLand));
    }
  };

  const appendClaimedLands = (newLand: Land) => {
    if (
      claimedLands.filter((e: any) => e.x === newLand.x && e.y === newLand.y)
        .length === 0 &&
      newLand.x >= 0 &&
      newLand.y >= 0
    ) {
      setClaimedLands(claimedLands.concat(newLand));
    }
  };

  const appendMyClaimedLands = (newLand: Land) => {
    if (
      myClaimedLands.filter((e: any) => e.x === newLand.x && e.y === newLand.y)
        .length === 0 &&
      newLand.x >= 0 &&
      newLand.y >= 0
    ) {
      setMyClaimedLands(myClaimedLands.concat(newLand));
    }
  };

  const drawTiers = (ctx: any) => {
    for (let i = 0; i < tierBordersJson.length; i++) {
      if (i === 0) ctx.fillStyle = "#9966ff";
      else if (i === 1) ctx.fillStyle = "#3399ff";
      else if (i === 2) ctx.fillStyle = "#33ff66";
      else if (i === 3) ctx.fillStyle = "#ffff33";
      else ctx.fillStyle = "#66ffff";

      const nodes = tierBordersJson[i].nodes;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let j = 1; j < nodes.length; j++) {
        ctx.lineTo(nodes[j].x, nodes[j].y);
      }
      ctx.fill();
    }
  };

  const drawLandBorders = (ctx: any) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 0.06;
    for (let i = 0; i < 99; i++) {
      ctx.beginPath();
      ctx.moveTo(i + 1, 0);
      ctx.lineTo(i + 1, 100);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i + 1);
      ctx.lineTo(100, i + 1);
      ctx.stroke();
    }
  };

  const drawCollectionBorders = (ctx: any) => {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.lineWidth = 0.2;
    for (let i = 0; i < collectionBordersJson.length; i++) {
      const nodes = collectionBordersJson[i].nodes;
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let j = 1; j < nodes.length; j++) {
        ctx.lineTo(nodes[j].x, nodes[j].y);
      }
      ctx.stroke();
    }
  };

  const drawCollectionTitles = (ctx: any) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";

    for (let i = 0; i < collectionTitlesJson.length; i++) {
      const titleObj = collectionTitlesJson[i];
      ctx.save();
      ctx.translate(titleObj.originX, titleObj.originY);
      ctx.font = titleObj.size + "px Georgia";
      if (titleObj.rotate) ctx.rotate(-Math.PI / 2);
      ctx.fillText(titleObj.title, 0, 0);
      ctx.restore();
    }
  };

  const drawClaimedLand = () => {
    const canvas: any = canvasRef.current;
    if (canvas && claimedLands.length > 0) {
      const ctx = canvas.getContext("2d");
      for (let i = 0; i < claimedLands.length; i++) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(claimedLands[i].x - 1, claimedLands[i].y - 1, 1, 1);
      }
    }
  };

  const drawMyClaimedLand = () => {
    const canvas: any = canvasRef.current;
    if (canvas && myClaimedLands.length > 0) {
      const ctx = canvas.getContext("2d");
      for (let i = 0; i < myClaimedLands.length; i++) {
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.lineWidth = 0.1;
        ctx.strokeRect(myClaimedLands[i].x - 1, myClaimedLands[i].y - 1, 1, 1);
      }
    }
  };
  
  const drawRoyalLand = () => {
    const canvas: any = canvasRef.current;
    const royallen = royalLands.length ? royalLands.length : 0;
    const ctx = canvas.getContext("2d");
    const divRate = Math.pow(1.25, countMul);

    let tmpX, tmpY;
    if (offsetX > zoomX) tmpX = zoomX + Math.ceil((offsetX - zoomX) / divRate);
    else tmpX = zoomX - Math.ceil((zoomX - offsetX) / divRate);
    if (offsetY > zoomY) tmpY = zoomY + Math.ceil((offsetY - zoomY) / divRate);
    else tmpY = zoomY - Math.ceil((zoomY - offsetY) / divRate);
    const x1 = tmpX - Math.ceil(tmpX / divRate);
    const x2 = tmpX + Math.floor((100 - tmpX) / divRate);
    const y1 = tmpY - Math.ceil(tmpY / divRate);
    const y2 = tmpY + Math.floor((100 - tmpY) / divRate);
    for (let i = 0; i < royallen; i++) {
      const x = royalLands[i].x;
      const y = royalLands[i].y;
      if (x > x1 && x < x2 && y > y1 && y < y2) {
        const imgsrc = royalLands[i].src ? royalLands[i].src : "";
        if (imgsrc !== "") {
          const img = new Image();
          img.src = imgsrc;
          ctx.drawImage(img, x - 1, y - 1, 1, 1);
        }
      }
    }
  };

  const zoom = (delta: any) => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let factor = 1.25; // zoomed scale index
    if (delta > 2) {
      // if zoom in
      if (countMul > 15) countMul = 15;
      else countMul++;
      flagScale = true;
    } else if (delta < 0) {
      // if zoom out
      countMul--;
      if (countMul < 0) countMul = 0;
      if (countMul === 0) {
        zoomX = offsetX;
        zoomY = offsetY;
        flagScale = false;
      }
    }
    if (delta === 2) {
      countMul = 2;
      zoomX = 50;
      zoomY = 50;
      offsetX = 50;
      offsetY = 50;
      initialFlag = false;
    }
    if (countMul > 9) setZoomed(true);
    if (flagScale || dragged) {
      // zoom or dragged
      factor = Math.pow(factor, countMul);
      const transX = zoomX + Math.ceil((offsetX - zoomX) / factor);
      const transY = zoomY + Math.ceil((offsetY - zoomY) / factor);
      const valScale = (canvasHeight * (1 - factor)) / 100; // transform scale rate
      ctx.resetTransform(); // reset to original map
      ctx.transform(
        factor,
        0,
        0,
        factor,
        valScale * (transX - 0.5),
        valScale * (transY - 0.5)
      );
      ctx.clearRect(0, 0, canvasHeight, canvasHeight); // clear the map
      redrawCanvas();
      zoomX = offsetX; // save X position of mouse pointer
      zoomY = offsetY; // save Y position of mouse pointer
    }
  };

  const draw = (ctx: any) => {
    drawTiers(ctx);
    drawLandBorders(ctx);
    drawCollectionBorders(ctx);
    drawClaimedLand();
    drawCollectionTitles(ctx);
    drawMyClaimedLand();
    if (zoomed) drawRoyalLand();
 };

  const redrawCanvas = () => {
    const canvas: any = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.scale(canvasHeight / 100, canvasHeight / 100);
      draw(ctx);
      ctx.restore();
    }
  };

  const handleClaim = async (landX: any, landY: any, collectionID: any) => {
    console.log("claim button clicked");
    console.log(landX, landY, collectionID);
    try {
      await claimLand(landX, landY, collectionID, {
        value: utils.parseEther("0.025"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkClaimedLand = (landX: any, landY: any) => {
    let isClaimed: string = "0";
    if (
      claimedLands.filter((e: any) => e.x === landX && e.y === landY).length > 0
    )
      isClaimed = "1";
    return isClaimed;
  };

  const handleScroll = function(evt: any) {
    const delta = evt.wheelDelta
      ? evt.wheelDelta / 40
      : evt.detail
      ? -evt.detail
      : 0;
    if (delta) {
      zoom(delta);
      if (delta < 0) setZoomed(false);
    }
    return evt.preventDefault() && false;
  };

  let dragged = false; // Flag of drag

  const initEventListners = () => {
    window.addEventListener("resize", updateSize);

    const canvas: any = canvasRef.current;
    if (canvas) {
      canvas.addEventListener(
        "mousedown",
        function (evt: any) {
          offsetX = Math.ceil((evt.offsetX / canvasHeight) * 100);
          offsetY = Math.ceil((evt.offsetY / canvasHeight) * 100);
          if (countMul !== 0) {
            // if zoomed
            const divIndex = countMul * 1.25; // zoomed rate

            // set the claimed position in zoom
            if (offsetX > zoomX)
              offsetX = zoomX + Math.ceil((offsetX - zoomX) / divIndex);
            else offsetX = zoomX - Math.ceil((zoomX - offsetX) / divIndex);
            if (offsetY > zoomY)
              offsetY = zoomY + Math.ceil((offsetY - zoomY) / divIndex);
            else offsetY = zoomY - Math.ceil((zoomY - offsetY) / divIndex);
          }
          const landX: any = selectedLandX.current;
          const landY: any = selectedLandY.current;

          offsetX = offsetX === 0 ? 1 : offsetX;
          offsetY = offsetY === 0 ? 1 : offsetY;
          landX.innerHTML = offsetX.toString();
          landY.innerHTML = offsetY.toString();
        },
        false
      );
      canvas.addEventListener(
        "mousemove",
        function(evt: any) {
          offsetX = Math.ceil((evt.offsetX / canvasHeight) * 100);
          offsetY = Math.ceil((evt.offsetY / canvasHeight) * 100);
          if (countMul > 0) dragged = true;
          else dragged = false;
          if (dragged) {
            zoom(1);
          }
        },
        false
      );
      canvas.addEventListener(
        "mouseup",
        function(evt: any) {
          dragged = false;
        },
        false
      );
      canvas.addEventListener("DOMMouseScroll", handleScroll, false);
      canvas.addEventListener("mousewheel", handleScroll, false);
    }
  };

  useEffect(() => {
    initEventListners();
    if (initialFlag) zoom(2);
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [draw]);

  return (
    <Box border="solid 1px" display="flex" alignItems="center">
      <LandModal
        onClaim={handleClaim}
        isMobile={isMobile}
        doPostTransaction={doPostTransaction}
        checkClaimedLand={checkClaimedLand}
      >
        <canvas
          ref={canvasRef}
          width={`${canvasSize}`}
          height={`${canvasSize}`}
        />
      </LandModal>
      {Array.from({ length: parseInt(totalLandsValue) }, (_, i) => 0 + i).map(
        (index) => {
          const landDiv = (
            <LandDetail
              index={index}
              key={index}
              onFoundLand={appendClaimedLands}
            />
          );
          return landDiv;
        }
      )}
      {Array.from({ length: parseInt(myTotalLandsValue) }, (_, i) => 0 + i).map(
        (index) => {
          const landDiv = (
            <MyLandDetail
              owner={account}
              index={index}
              key={index}
              onFoundLand={appendMyClaimedLands}
            />
          );
          return landDiv;
        }
      )}
      {Array.from({ length: parseInt(totalLandsValue) }, (_, i) => 0 + i).map(
        (index) => {
          const landDiv = (
            <LandRoyal
              index={index}
              key={index}
              onFoundLand={appendRoyalLands}
            />
          );
          return landDiv;
        }
      )}
      <div id="selectedLandX" ref={selectedLandX} hidden={true}>
        1
      </div>
      <div id="selectedLandY" ref={selectedLandY} hidden={true}>
        1
      </div>
    </Box>
  );
}
