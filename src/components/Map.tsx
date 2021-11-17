import { useRef, useState, useEffect } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { GetTotalSupply, GetBalanceOf, useContractMethod } from "../hooks";
import LandDetail from "./LandDetail";
import MyLandDetail from "./MyLandDetail";
import LandRoyal from "./LandRoyal";
import collectionBordersJson from "../borders/CollectionBorders.json";
import collectionTitlesJson from "../borders/CollectionTitles.json";
import tierBordersJson from "../borders/TierBorders.json";
import LandModal from "./LandModal";
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";
import "./font.css";

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
  let touchDragged = false;
  let offsetX = 0; // X position of mouse pointer
  let offsetY = 0; // Y position of mouse pointer
  let touchOffsetX = 0; // X position of touch pointer
  let touchOffsetY = 0; // Y position of touch pointer
  let innerX = 0;
  let innerY = 0; // Y position of mouse pointer in the canvas
  let countMul = 2; // count of zoomed

  let zoomX = 0; // X position of previous zoomed
  let zoomY = 0; // Y position of previous zoomed

  const { account } = useEthers();
  const totalLands = GetTotalSupply();
  const myTotalLands = GetBalanceOf(account);
  const toast = useToast();
  const { state, send: claimLand } = useContractMethod("claimLand");

  const [clickedX, setClickedX] = useState(1);
  const [clickedY, setClickedY] = useState(1);
  const [totalLandsValue, setTotalLandsValue] = useState("");
  const [myTotalLandsValue, setMyTotalLandsValue] = useState("0");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [claimedLands, setClaimedLands] = useState<Land[]>([]);
  const [myClaimedLands, setMyClaimedLands] = useState<Land[]>([]);
  const [royalLands, setRoyalLands] = useState<RoyalLand[]>([]);

  const canvasRef = useRef(null);
  const isMobile = window.screen.width <= window.screen.height ? true : false;
  const canvasHeight = Math.round(window.innerHeight / (100 / 90));
  const canvasWidth = Math.round(window.innerWidth / (100 / 90));
  const [canvasSize, setCanvasSize] = useState(
    isMobile
      ? { w: canvasHeight, h: canvasWidth }
      : { w: canvasWidth, h: canvasHeight }
  );

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
    const mheight = Math.round(window.innerHeight / (100 / 90));
    const mwidth = Math.round(window.innerWidth / (100 / 90));
    if (isMobile) {
      setCanvasSize({ w: mheight, h: mwidth });
    } else setCanvasSize({ w: mwidth, h: mheight });
  };

  const appendRoyalLands = (newLand: RoyalLand) => {
    let _royalLands = JSON.parse(JSON.stringify(royalLands));
    if (
      _royalLands.filter(
        (e: any) =>
          e.x === newLand.x && e.y === newLand.y && e.src === newLand.src
      ).length === 0 &&
      newLand.x >= 0 &&
      newLand.y >= 0 &&
      newLand.src
    ) {
      _royalLands.push(newLand);
      setRoyalLands(_royalLands);
    }
    localStorage.setItem("royalLands", JSON.stringify(_royalLands));
  };

  const appendClaimedLands = (newLand: Land) => {
    let _claimedLands = JSON.parse(JSON.stringify(claimedLands));
    if (
      _claimedLands.filter((e: any) => e.x === newLand.x && e.y === newLand.y)
        .length === 0 &&
      newLand.x >= 0 &&
      newLand.y >= 0
    ) {
      _claimedLands.push(newLand);
      setClaimedLands(_claimedLands);
    }
    localStorage.setItem("claimedLands", JSON.stringify(_claimedLands));
  };

  const appendMyClaimedLands = (newLand: Land) => {
    let _myClaimedLands = JSON.parse(JSON.stringify(myClaimedLands));
    if (
      _myClaimedLands.filter((e: any) => e.x === newLand.x && e.y === newLand.y)
        .length === 0 &&
      newLand.x >= 0 &&
      newLand.y >= 0
    ) {
      _myClaimedLands.push(newLand);
      setMyClaimedLands(_myClaimedLands);
    }
    localStorage.setItem("myClaimedLands", JSON.stringify(_myClaimedLands));
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

  const drawPointerOutLine = (ctx: any) => {
    const curJson = localStorage.getItem("curPoint");
    if (curJson) {
      const _curPoint = JSON.parse(curJson);
      ctx.strokeStyle = "rgb(255, 255, 255, 0.8)";
      ctx.lineWidth = 0.1;
      ctx.strokeRect(_curPoint.x - 0.95, _curPoint.y - 0.95, 0.9, 0.9);
    }
  };

  const drawCollectionTitles = (ctx: any) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgb(0, 0, 0, 0.8)";

    for (let i = 0; i < collectionTitlesJson.length; i++) {
      const titleObj = collectionTitlesJson[i];
      ctx.save();
      ctx.translate(titleObj.originX, titleObj.originY);
      ctx.font = titleObj.size + "px changa";
      if (titleObj.rotate) ctx.rotate(-Math.PI / 2);
      ctx.fillText(titleObj.title, 0, 0);
      ctx.restore();
    }
  };

  const drawClaimedLand = () => {
    const canvas: any = canvasRef.current;
    const claimJson = localStorage.getItem("claimedLands");
    const _claimed = claimJson !== null ? JSON.parse(claimJson) : claimedLands;
    if (canvas && _claimed.length > 0) {
      const ctx = canvas.getContext("2d");
      for (let i = 0; i < _claimed.length; i++) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(_claimed[i].x - 1, _claimed[i].y - 1, 1, 1);
      }
    }
  };

  const drawMyClaimedLand = () => {
    const canvas: any = canvasRef.current;
    const myClaimJson = localStorage.getItem("myClaimedLands");
    const _myClaimed =
      myClaimJson !== null ? JSON.parse(myClaimJson) : myClaimedLands;
    if (canvas && _myClaimed.length > 0) {
      const ctx = canvas.getContext("2d");
      for (let i = 0; i < _myClaimed.length; i++) {
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.lineWidth = 0.3;
        ctx.strokeRect(_myClaimed[i].x - 1, _myClaimed[i].y - 1, 1, 1);
      }
    }
  };

  const drawRoyalLand = () => {
    const canvas: any = canvasRef.current;
    const royalJson = localStorage.getItem("royalLands");
    const _royaled = royalJson !== null ? JSON.parse(royalJson) : royalLands;
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
    for (let i = 0; i < _royaled.length; i++) {
      const x = _royaled[i].x;
      const y = _royaled[i].y;
      if (x > x1 && x < x2 && y > y1 && y < y2) {
        const imgsrc = _royaled[i].src ? _royaled[i].src : "";
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
      if (canvasWidth < canvasHeight && countMul === 0) countMul = 1;
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
      innerY = (canvasSize.h * 50) / canvasSize.w;
      offsetY = 50;
    }
    if (flagScale || dragged) {
      // zoom or dragged
      factor = Math.pow(factor, countMul);
      const transX = zoomX + (offsetX - zoomX) / factor;
      const transY = zoomY + (offsetY - zoomY) / factor;
      const valScaleX = (canvasSize.w * (1 - factor)) / 100; // transform scale rate
      const valScaleY = (canvasSize.h * (1 - factor)) / 100; // transform scale rate
      ctx.resetTransform(); // reset to original map
      let dx = 0.25;
      let dy = 0.25;
      if (offsetX < 1) dx = 0.25;
      else if (offsetX > 99) dx = -0.25;
      if (offsetY < 1) dy = 0.25;
      else if (offsetY > 99) dy = -0.25;
      const my = (canvasSize.w * (innerY - offsetY)) / 100;
      ctx.transform(
        factor,
        0,
        0,
        factor,
        valScaleX * (transX - dx),
        valScaleY * (transY - dy)
      );
      ctx.transform(1, 0, 0, 1, 0, my);
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.w); // clear the map
      redrawCanvas();
      zoomX = offsetX; // save X position of mouse pointer
      zoomY = offsetY; // save Y position of mouse pointer
    }
  };

  const zoomTouch = (delta: any) => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let factor = 1.25; // zoomed scale index
    if (delta > 2) {
      // if zoom in
      if (countMul > 15) countMul = 15;
      else countMul++;
      touchDragged = true;
    } else if (delta < 0) {
      // if zoom out
      countMul--;
      touchDragged = true;
      if (countMul < 0) countMul = 0;
      if (countMul === 0) {
        zoomX = touchOffsetX;
        zoomY = touchOffsetY;
        // touchDragged = false;
      }
    }
    if (delta === 2) {
      countMul = 2;
      zoomX = 50;
      zoomY = 50;
      touchOffsetX = 50;
      innerX = (canvasWidth * 50) / canvasHeight;
      touchOffsetY = 50;
      touchDragged = true;
      delta = 0;
    }
    if (touchDragged) {
      // zoom or dragged
      factor = Math.pow(factor, countMul);
      const transX = zoomX + (touchOffsetX - zoomX) / factor;
      const transY = zoomY + (touchOffsetY - zoomY) / factor;
      const valScaleX = (canvasWidth * (1 - factor)) / 100; // transform scale rate
      const valScaleY = (canvasHeight * (1 - factor)) / 100; // transform scale rate
      ctx.resetTransform(); // reset to original map
      let dx = 0.25;
      let dy = 0.25;
      if (touchOffsetX < 1) dx = 0.25;
      else if (touchOffsetX > 99) dx = -0.25;
      if (touchOffsetY < 1) dy = 0.25;
      else if (touchOffsetY > 99) dy = -0.25;
      const mx = (canvasHeight * (innerX - touchOffsetX)) / 100 - dx;
      ctx.transform(
        factor,
        0,
        0,
        factor,
        valScaleX * (transX - dx),
        valScaleY * (transY - dy)
      );
      ctx.transform(1, 0, 0, 1, mx, 0);
      ctx.clearRect(0, 0, canvasHeight, canvasHeight); // clear the map
      redrawCanvas();
      zoomX = touchOffsetX; // save X position of mouse pointer
      zoomY = touchOffsetY; // save Y position of mouse pointer
    }
  };

  const dragdraw = () => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (canvasWidth > canvasHeight) {
      const transY = innerY - offsetY;
      ctx.resetTransform(); // reset to original map
      let dy = 0.5;
      if (offsetY < 5) dy = 1;
      else if (offsetY > 95) dy = 0;
      ctx.transform(1, 0, 0, 1, 0, (canvasSize.w * transY) / 100 - dy);
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.w); // clear the map
      redrawCanvas();
    } else {
      ctx.resetTransform(); // reset to original map
      ctx.clearRect(0, 0, canvasSize.h, canvasSize.h); // clear the map
      redrawCanvas();
    }
  };

  const draw = (ctx: any) => {
    drawTiers(ctx);
    drawLandBorders(ctx);
    drawClaimedLand();
    drawCollectionTitles(ctx);
    drawMyClaimedLand();
    drawCollectionBorders(ctx);
    drawRoyalLand();
    drawPointerOutLine(ctx);
  };

  const redrawCanvas = () => {
    const canvas: any = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.scale(canvasSize.w / 100, canvasSize.w / 100);
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

  const handleScroll = function (evt: any) {
    const delta = evt.wheelDelta
      ? evt.wheelDelta / 40
      : evt.detail
      ? -evt.detail
      : 0;
    if (delta) {
      if (isMobile) zoomTouch(delta);
      else zoom(delta);
    }
    return evt.preventDefault() && false;
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  function getPos(offsetpos: any) {
    if (offsetpos > 100) return 100;
    else if (offsetpos < 0) return 0;
    else return offsetpos;
  }

  let dragged = false; // Flag of drag
  let zoomTouchPos1 = { x: 0, y: 0 };
  let zoomTouchPos2 = { x: 0, y: 0 };
  let distZoom = 0;

  const initEventListners = () => {
    window.addEventListener("resize", updateSize);

    const canvas: any = canvasRef.current;
    if (canvas) {
      canvas.addEventListener(
        "touchstart",
        function touchEventHandler(evt: any) {
          if (evt.targetTouches.length === 2) {
            const touch1: any = evt.changedTouches[0];
            const touch2: any = evt.changedTouches[1];
            if (touch1 && touch2) {
              zoomTouchPos1.x =
                ((touch1.clientX - touch1.target.offsetLeft) / canvasWidth) *
                100;
              zoomTouchPos1.y =
                ((touch1.clientY - touch1.target.offsetTop) / canvasHeight) *
                100;
              zoomTouchPos2.x =
                ((touch2.clientX - touch2.target.offsetLeft) / canvasWidth) *
                100;
              zoomTouchPos2.y =
                ((touch2.clientY - touch2.target.offsetTop) / canvasHeight) *
                100;
              distZoom = Math.sqrt(
                Math.pow(zoomTouchPos1.x - zoomTouchPos2.x, 2) +
                  Math.pow(zoomTouchPos1.y - zoomTouchPos2.y, 2)
              );
              if (zoomTouchPos1.x > zoomTouchPos2.x)
                touchOffsetX = getPos(
                  zoomTouchPos2.x +
                    ((zoomTouchPos1.x - zoomTouchPos2.x) * canvasWidth) /
                      canvasHeight
                );
              else
                touchOffsetX = getPos(
                  zoomTouchPos2.x -
                    ((zoomTouchPos2.x - zoomTouchPos1.x) * canvasWidth) /
                      canvasHeight
                );
              touchOffsetY = getPos((zoomTouchPos1.y + zoomTouchPos2.y) / 2);
              innerX = getPos(innerX);
              if (countMul !== 0) {
                // if zoomed
                const divIndex = Math.pow(1.25, countMul); // zoomed rate

                // set the claimed position in zoom
                if (zoomTouchPos1.x > zoomTouchPos2.x)
                  touchOffsetX = Math.ceil(
                    zoomTouchPos2.x +
                      (zoomTouchPos1.x - zoomTouchPos2.x) / divIndex
                  );
                else
                  touchOffsetX = Math.ceil(
                    zoomTouchPos2.x -
                      (zoomTouchPos2.x - zoomTouchPos1.x) / divIndex
                  );
                if (zoomTouchPos1.y > zoomTouchPos2.y)
                  touchOffsetY =
                    zoomTouchPos2.y +
                    Math.ceil((zoomTouchPos1.y - zoomTouchPos2.y) / divIndex);
                else
                  touchOffsetY = Math.ceil(
                    zoomTouchPos2.y -
                      (zoomTouchPos2.y - zoomTouchPos1.y) / divIndex
                  );
              }
            }
          } else if (evt.targetTouches.length === 1) {
            console.log("touchstart", evt.targetTouches);
            const touch: any = evt.changedTouches[0];
            if (touch) {
              touchOffsetX =
                ((touch.clientX - touch.target.offsetLeft) / canvasWidth) * 100;
              touchOffsetY =
                ((touch.clientY - touch.target.offsetTop) / canvasHeight) * 100;
              innerX =
                ((touch.clientX - touch.target.offsetLeft) / canvasHeight) *
                100;
              if (touchOffsetX > zoomX)
                touchOffsetX = getPos(
                  zoomX + ((touchOffsetX - zoomX) * canvasWidth) / canvasHeight
                );
              else
                touchOffsetX = getPos(
                  zoomX - ((zoomX - touchOffsetX) * canvasWidth) / canvasHeight
                );
              touchOffsetY = getPos(touchOffsetY);
              innerX = getPos(innerX);
              if (countMul !== 0) {
                // if zoomed
                const divIndex = Math.pow(1.25, countMul); // zoomed rate

                // set the claimed position in zoom
                if (touchOffsetX > zoomX)
                  touchOffsetX = Math.ceil(
                    zoomX + (touchOffsetX - zoomX) / divIndex
                  );
                else
                  touchOffsetX = Math.ceil(
                    zoomX - (zoomX - touchOffsetX) / divIndex
                  );
                if (touchOffsetY > zoomY)
                  touchOffsetY =
                    zoomY + Math.ceil((touchOffsetY - zoomY) / divIndex);
                else
                  touchOffsetY = Math.ceil(
                    zoomY - (zoomY - touchOffsetY) / divIndex
                  );
              }

              offsetX = touchOffsetX === 0 ? 1 : Math.ceil(touchOffsetX);
              offsetY = touchOffsetY === 0 ? 1 : Math.ceil(touchOffsetY);

              setClickedX(offsetX);
              setClickedY(offsetY);
              touchDragged = false;
            }
          }
        },
        false
      );
      canvas.addEventListener(
        "touchmove",
        function touchEventHandler(evt: any) {
          if (evt.targetTouches.length === 2) {
            const touch1: any = evt.changedTouches[0];
            const touch2: any = evt.changedTouches[1];
            if (touch1 && touch2) {
              const zoomTouchPos1x =
                ((touch1.clientX - touch1.target.offsetLeft) / canvasWidth) *
                100;
              const zoomTouchPos1y =
                ((touch1.clientY - touch1.target.offsetTop) / canvasHeight) *
                100;
              const zoomTouchPos2x =
                ((touch2.clientX - touch2.target.offsetLeft) / canvasWidth) *
                100;
              const zoomTouchPos2y =
                ((touch2.clientY - touch2.target.offsetTop) / canvasHeight) *
                100;
              const distZoom2 = Math.sqrt(
                Math.pow(zoomTouchPos1x - zoomTouchPos2x, 2) +
                  Math.pow(zoomTouchPos1y - zoomTouchPos2y, 2)
              );
              const distanceZoom = distZoom2 - distZoom;
              if (distanceZoom > 15) zoomTouch(3);
              else if (distanceZoom < -15) zoomTouch(-3);
            }
          } else if (evt.targetTouches.length === 1) {
            const touch: any = evt.changedTouches[0];
            if (touch) {
              touchOffsetX =
                ((touch.clientX - touch.target.offsetLeft) / canvasWidth) * 100;
              touchOffsetY =
                ((touch.clientY - touch.target.offsetTop) / canvasHeight) * 100;
              innerX =
                ((touch.clientX - touch.target.offsetLeft) / canvasHeight) *
                100;
              if (touchOffsetX > zoomX)
                touchOffsetX = getPos(
                  zoomX + ((touchOffsetX - zoomX) * canvasWidth) / canvasHeight
                );
              else
                touchOffsetX = getPos(
                  zoomX - ((zoomX - touchOffsetX) * canvasWidth) / canvasHeight
                );
              touchOffsetY = getPos(touchOffsetY);
              let curPoint: Land = {
                x: Math.ceil(touchOffsetX),
                y: Math.ceil(touchOffsetY),
              };
              if (countMul !== 0) {
                // if zoomed
                const divIndex = countMul * 1.25; // zoomed rate

                // set the claimed position in zoom
                if (curPoint.x > zoomX)
                  curPoint.x = Math.floor(
                    zoomX +
                      Math.ceil(
                        ((curPoint.x - zoomX) * canvasWidth) /
                          (divIndex * canvasHeight)
                      )
                  );
                else
                  curPoint.x = Math.floor(
                    zoomX -
                      Math.ceil(
                        ((zoomX - curPoint.x) * canvasWidth) /
                          (divIndex * canvasHeight)
                      )
                  );
                if (curPoint.y > zoomY)
                  curPoint.y = Math.floor(
                    zoomY + Math.ceil((curPoint.y - zoomY) / divIndex)
                  );
                else
                  curPoint.y = Math.floor(
                    zoomY - Math.ceil((zoomY - curPoint.y) / divIndex)
                  );
                if (curPoint.x > 100) curPoint.x = 100;
                if (curPoint.y > 100) curPoint.y = 100;
                if (curPoint.x < 1) curPoint.x = 1;
                if (curPoint.y < 1) curPoint.y = 1;
              } else
                curPoint = {
                  x: Math.ceil(touchOffsetX),
                  y: Math.ceil(touchOffsetY),
                };
              localStorage.setItem("curPoint", JSON.stringify(curPoint));
              innerX = getPos(innerX);
              console.log("touchpos:", innerX, touchOffsetX, touchOffsetY);
              console.log("curPoint:", curPoint);
              touchDragged = true;
              zoomTouch(1);
            }
          }
        },
        false
      );
      canvas.addEventListener(
        "touchend",
        function touchEventHandler(evt: any) {
          console.log("touchend");
          if (!touchDragged) setIsOpenModal(true);
          touchDragged = false;
        },
        false
      );
      canvas.addEventListener(
        "mousedown",
        function (evt: any) {
          if (!isMobile) {
            offsetX = Math.ceil((evt.offsetX / canvasSize.w) * 100);
            offsetY = Math.ceil((evt.offsetY / canvasSize.h) * 100);
            innerY = Math.ceil((evt.offsetY / canvasSize.w) * 100);
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

            offsetX = offsetX === 0 ? 1 : Math.floor(offsetX);
            offsetY = offsetY === 0 ? 1 : Math.floor(offsetY);
            setClickedX(offsetX);
            setClickedY(offsetY);
            setIsOpenModal(true);
          }
        },
        false
      );
      canvas.addEventListener(
        "mousemove",
        function (evt: any) {
          if (!isMobile) {
            offsetX = (evt.offsetX / canvasSize.w) * 100;
            offsetY = (evt.offsetY / canvasSize.h) * 100;
            innerY = (evt.offsetY / canvasSize.w) * 100;

            let curPoint: Land = {
              x: Math.ceil(offsetX),
              y: Math.ceil(offsetY),
            };
            if (countMul !== 0) {
              // if zoomed
              const divIndex = countMul * 1.25; // zoomed rate

              // set the claimed position in zoom
              if (curPoint.x > zoomX)
                curPoint.x = Math.floor(
                  zoomX + Math.ceil((curPoint.x - zoomX) / divIndex)
                );
              else
                curPoint.x = Math.floor(
                  zoomX - Math.ceil((zoomX - curPoint.x) / divIndex)
                );
              if (curPoint.y > zoomY)
                curPoint.y = Math.floor(
                  zoomY + Math.ceil((curPoint.y - zoomY) / divIndex)
                );
              else
                curPoint.y = Math.floor(
                  zoomY - Math.ceil((zoomY - curPoint.y) / divIndex)
                );
              if (curPoint.x > 100) curPoint.x = 100;
              if (curPoint.y > 100) curPoint.y = 100;
              if (curPoint.x < 1) curPoint.x = 1;
              if (curPoint.y < 1) curPoint.y = 1;
            } else curPoint = { x: Math.ceil(offsetX), y: Math.ceil(offsetY) };
            localStorage.setItem("curPoint", JSON.stringify(curPoint));
            if (countMul > 0) dragged = true;
            else dragged = false;
            if (dragged) {
              zoom(1);
            } else dragdraw();
          }
        },
        false
      );
      canvas.addEventListener(
        "mouseup",
        function (evt: any) {
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
    localStorage.clear();
    if (isMobile) zoomTouch(2);
    else zoom(2);
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [draw]);

  return (
    <>
      <Box border="solid 1px" display="flex" alignItems="center">
        <canvas
          ref={canvasRef}
          width={`${canvasWidth}`}
          height={`${canvasHeight}`}
        />
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
        {Array.from(
          { length: parseInt(myTotalLandsValue) },
          (_, i) => 0 + i
        ).map((index) => {
          const landDiv = (
            <MyLandDetail
              owner={account}
              index={index}
              key={index}
              onFoundLand={appendMyClaimedLands}
            />
          );
          return landDiv;
        })}
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
      </Box>
      <LandModal
        isOpenModal={isOpenModal}
        onCloseModal={handleCloseModal}
        landX={clickedX}
        landY={clickedY}
        onClaim={handleClaim}
        isMobile={isMobile}
        doPostTransaction={doPostTransaction}
        checkClaimedLand={checkClaimedLand}
      ></LandModal>
    </>
  );
}
