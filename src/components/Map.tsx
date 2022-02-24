import { useRef, useState, useEffect } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { GetTotalSupply, GetBalanceOf, useContractMethod } from "../hooks";
import { MoveDirection } from "react-tsparticles";
import ParticleDiv from "./ParticleDiv";
import collectionBordersJson from "../borders/CollectionBorders.json";
import collectionTitlesJson from "../borders/CollectionTitles_new.json";
import tierBordersJson from "../borders/TierBorders.json";
import LandModal from "./LandModal";
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";
import "./Map.css";
import {
  getClaimedLands,
  getRoyalLands,
  setClaimedLand,
  setClaimedRoyal,
  setClaimedDerivative,
} from "../service/api";

export default function Map() {
  interface Land {
    x: number;
    y: number;
  }

  interface RoyalLand {
    x: number;
    y: number;
    derivative: string;
    src: string;
  }

  let nogif = 0;
  let isDown = false;
  let orinPos: Land = { x: 0, y: 0 };
  let curPos: Land = { x: 0, y: 0 };
  let countMul = 0; // count of zoomed
  let zoomed = false;
  let zoomtimed = false;

  const { account } = useEthers();
  const totalLands = GetTotalSupply();
  const myTotalLands = GetBalanceOf(account);
  const toast = useToast();
  const { state, send: claimLand } = useContractMethod("claimLand");

  const [strMove, setStrMove] = useState<MoveDirection>(MoveDirection.right);
  const [valSize, setValSize] = useState(1);
  const [clickedX, setClickedX] = useState(0);
  const [clickedY, setClickedY] = useState(0);
  const [canvasCursor, setCanvasCursor] = useState("pointer");
  const [totalLandsValue, setTotalLandsValue] = useState("");
  const [myTotalLandsValue, setMyTotalLandsValue] = useState("0");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [claimedLands, setClaimedLands] = useState<Land[]>([]);
  const [royalLands, setRoyalLands] = useState<RoyalLand[]>([]);

  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const isMobile = window.screen.width <= window.screen.height ? true : false;
  const canvasHeight = Math.round(window.innerHeight / (100 / 90));
  const canvasWidth = Math.round(window.innerWidth / (100 / 90));
  const [canvasSize, setCanvasSize] = useState(
    canvasHeight > canvasWidth
      ? { w: canvasHeight, h: canvasWidth }
      : { w: canvasWidth, h: canvasHeight }
  );

  const updateClaimedLands = async () => {
    const _claimedLands = await getClaimedLands();
    setClaimedLands(_claimedLands);
    localStorage.setItem("claimedLands", JSON.stringify(_claimedLands));
  };

  const updateRoyalLands = async () => {
    const _royalLands = await getRoyalLands();
    setRoyalLands(_royalLands);
    localStorage.setItem("royalLands", JSON.stringify(_royalLands));
    handleDrawCanvas();
  };

  useEffect(() => {
    updateClaimedLands();
    updateRoyalLands();
    const intervalId = setInterval(() => {
      try {
        updateClaimedLands();
        updateRoyalLands();
      } catch (e) {}
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

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

  useEffect(() => {
    const interval = setInterval(() => {
      nogif++;
      if (nogif >= 60) nogif = 0;
      localStorage.setItem("nogif", JSON.stringify(nogif));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const doPostTransaction = (state: any) => {
    let msg = "";
    console.log(state);
    switch (state.status) {
      case "Success":
        recordSuccess();
        msg = "Success. Your assets will be shown soon.";
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
        const errMsg = state.errorMessage;
        if (errMsg.includes("not contained"))
          msg = "This collection is not registered by the admin. Please wait.";
        else if (errMsg.includes("Don't own any NFT in this collection"))
          msg =
            "You can't mint this land. You don't hold any NFT(s) in this collection.";
        else if (errMsg.includes("Already claimed all lands"))
          msg =
            "You can't mint this land. You've already claimed all lands in this collection.";
        else if (errMsg.includes("You are not the owner of this land"))
          msg = "You should be the owner of this land.";
        else if (errMsg.includes("You are not the owner of this tokenID"))
          msg = "You should be the owner of this NFT";
        else if (errMsg.includes("This royal NFT is already used"))
          msg = "This royal NFT is already used";
        else msg = errMsg;
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

  const recordSuccess = () => {
    const typeItem = localStorage.getItem("pendingAPITypes");
    const type = typeItem !== null ? JSON.parse(typeItem) : 0;
    if (type > 0) {
      if (type === 1) {
        const pendingLands = localStorage.getItem("pendingLands");
        const parsedLands =
          pendingLands !== null ? JSON.parse(pendingLands) : null;
        if (parsedLands) {
          setClaimedLand(parsedLands.x, parsedLands.y);
        }
      } else if (type === 2) {
        const pendingRoyals = localStorage.getItem("pendingRoyals");
        const parsedRoyals =
          pendingRoyals !== null ? JSON.parse(pendingRoyals) : null;
        if (parsedRoyals) {
          setClaimedRoyal(
            parsedRoyals.x,
            parsedRoyals.y,
            parsedRoyals.imageSrc
          );
        }
      } else if (type === 3) {
        const pendingDerivatives = localStorage.getItem("pendingDerivatives");
        const parsedDerivatives =
          pendingDerivatives !== null ? JSON.parse(pendingDerivatives) : null;
        if (parsedDerivatives) {
          setClaimedDerivative(parsedDerivatives.x, parsedDerivatives.y);
        }
      }
    }
  };

  const updateSize = () => {
    const mheight = Math.round(window.innerHeight / (100 / 90));
    const mwidth = Math.round(window.innerWidth / (100 / 90));
    if (canvasHeight > canvasWidth) {
      setCanvasSize({ w: mheight, h: mwidth });
    } else setCanvasSize({ w: mwidth, h: mheight });
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

  const drawPointerOutLine = () => {
    const canvas: any = canvasRef2.current;
    const zoomScale = (Math.pow(1.15, countMul) * canvasSize.w) / 100;
    const curJson = localStorage.getItem("curPoint");
    if (canvas && curJson) {
      const ctx = canvas.getContext("2d");
      ctx.resetTransform();
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.w);
      ctx.scale(zoomScale, zoomScale);
      ctx.transform(1, 0, 0, 1, -orinPos.x, -orinPos.y);
      const _curPoint = JSON.parse(curJson);
      const curX = Math.ceil(_curPoint.x);
      const curY = Math.ceil(_curPoint.y);
      const strPoint = curX.toString() + "," + curY.toString();
      ctx.strokeStyle = "rgb(255, 255, 255, 0.8)";
      ctx.lineWidth = 0.1;
      ctx.strokeRect(curX - 0.95, curY - 0.95, 0.9, 0.9);
      ctx.textAlign = "left";
      ctx.font = "0.8px Changa One";
      ctx.fillStyle = "rgb(255, 255, 255, 0.9)";
      ctx.fillText(strPoint, curX, curY - 1.5);
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
      ctx.font = titleObj.size + "px Changa One";
      if (titleObj.rotate) ctx.rotate(-Math.PI / 2);
      ctx.fillText(titleObj.title, 0, 0);
      ctx.restore();
    }
  };

  const drawClaimedLand = (ctx: any) => {
    const claimJson = localStorage.getItem("claimedLands");
    const _claimed = claimJson !== null ? JSON.parse(claimJson) : claimedLands;
    if (_claimed.length > 0) {
      for (let i = 0; i < _claimed.length; i++) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(_claimed[i].x - 1, _claimed[i].y - 1, 1, 1);
      }
    }
  };

  function drawRoyalLand(ctx: any) {
    const royalJson = localStorage.getItem("royalLands");
    const _royaled = royalJson !== null ? JSON.parse(royalJson) : royalLands;
    const zoomScale = Math.pow(1.15, countMul);
    const limiw =
      canvasWidth > canvasHeight
        ? 100 / zoomScale
        : (100 * canvasSize.h) / (zoomScale * canvasSize.w);
    const limih =
      canvasWidth < canvasHeight
        ? 100 / zoomScale
        : (100 * canvasSize.h) / (zoomScale * canvasSize.w);
    for (let i = 0; i < _royaled.length; i++) {
      const x = _royaled[i].x;
      const y = _royaled[i].y;
      if (
        x >= orinPos.x &&
        x <= orinPos.x + limiw &&
        y >= orinPos.y &&
        y <= orinPos.y + limih
      ) {
        const imgsrc = _royaled[i].src ? _royaled[i].src : "";
        if (imgsrc !== "") {
          const img = new Image();
          img.onload = function () {
            ctx.drawImage(img, x - 1, y - 1, 1, 1);
          };
          img.src = imgsrc;
          ctx.drawImage(img, x - 1, y - 1, 1, 1);
          if (_royaled[i].derivative > 0) {
            const img2 = new Image();
            img2.src = "/assets/Deriv_Gradient/deriv(0).png";
            ctx.drawImage(img2, x - 1, y - 1, 1, 1);
          }
        }
      }
    }
  }

  function drawDerivative() {
    const canvas: any = canvasRef1.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const royalJson = localStorage.getItem("royalLands");
      const _royaled = royalJson !== null ? JSON.parse(royalJson) : royalLands;
      const zoomScale = Math.pow(1.15, countMul);
      const limiw =
        canvasWidth > canvasHeight
          ? 100 / zoomScale
          : (100 * canvasSize.h) / (zoomScale * canvasSize.w);
      const limih =
        canvasWidth < canvasHeight
          ? 100 / zoomScale
          : (100 * canvasSize.h) / (zoomScale * canvasSize.w);
      for (let i = 0; i < _royaled.length; i++) {
        const x = _royaled[i].x;
        const y = _royaled[i].y;
        if (
          x >= orinPos.x &&
          x <= orinPos.x + limiw &&
          y >= orinPos.y &&
          y <= orinPos.y + limih
        ) {
          const imgsrc = _royaled[i].src ? _royaled[i].src : "";
          const noJson = localStorage.getItem("nogif");
          const _nogif = noJson !== null ? JSON.parse(noJson) : 0;
          if (imgsrc !== "" && _royaled[i].derivative > 0) {
            const img = new Image();
            img.src =
              "/assets/Deriv_Gradient/deriv(" + _nogif.toString() + ").png";
            ctx.drawImage(img, x - 1, y - 1, 1, 1);
          }
        }
      }
    }
  }

  const draw = (ctx: any) => {
    drawTiers(ctx);
    drawLandBorders(ctx);
    drawClaimedLand(ctx);
    drawCollectionTitles(ctx);
    drawCollectionBorders(ctx);
    drawRoyalLand(ctx);
    drawDerivative();
    drawPointerOutLine();
  };

  const handleDrawCanvas = () => {
    const zoomScale = (Math.pow(1.15, countMul) * canvasSize.w) / 100;
    const canvas: any = canvasRef1.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.resetTransform();
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.w);
      if (zoomtimed && countMul <= 30) {
        const cn = countMul < 5 ? 10 : Math.floor(30 / countMul);
        const cv = Math.pow(1.15, countMul / cn);
        for (let i = 0; i < cn; i++) {
          ctx.transform(cv, 0, 0, cv, 0, 0);
          draw(ctx);
        }
        ctx.scale(canvasSize.w / 100, canvasSize.w / 100);
        ctx.transform(1, 0, 0, 1, -orinPos.x, -orinPos.y);
        draw(ctx);
      } else {
        ctx.scale(zoomScale, zoomScale);
        ctx.transform(1, 0, 0, 1, -orinPos.x, -orinPos.y);
        draw(ctx);
      }
    }
    zoomtimed = false;
  };

  const handleInit = () => {
    localStorage.clear();
    countMul = 6;
    const zoomScale = Math.pow(1.15, countMul);
    orinPos.x =
      canvasWidth > canvasHeight
        ? ((zoomScale - 1) * 50) / zoomScale
        : ((zoomScale * canvasHeight - canvasWidth) * 50) /
          (canvasHeight * zoomScale);
    orinPos.y =
      canvasWidth > canvasHeight
        ? ((zoomScale * canvasWidth - canvasHeight) * 50) /
          (canvasWidth * zoomScale)
        : ((zoomScale - 1) * 50) / zoomScale;
    handleDrawCanvas();
  };

  const handleClaim = async (landX: any, landY: any, collectionID: any) => {
    console.log("claim button clicked");
    console.log(landX, landY, collectionID);

    const pendingLands = { x: landX, y: landY };
    localStorage.setItem("pendingAPITypes", JSON.stringify(1));
    localStorage.setItem("pendingLands", JSON.stringify(pendingLands));

    try {
      if (
        (parseInt(collectionID) >= 0 && parseInt(collectionID) <= 6) ||
        (parseInt(collectionID) >= 38 && parseInt(collectionID) <= 44)
      )
        // collections for Honorary and metakey
        await claimLand(landX, landY, collectionID, {
          value: utils.parseEther("0"),
        });
      else
        await claimLand(landX, landY, collectionID, {
          value: utils.parseEther("0.03"),
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

  const handleScroll = (evt: any) => {
    const posX = (evt.offsetX / canvasSize.w) * 100;
    const posY = (evt.offsetY / canvasSize.w) * 100;
    const delta = evt.wheelDelta
      ? evt.wheelDelta / 40
      : evt.detail
      ? -evt.detail
      : 0;
    if (delta) {
      zoomed = true;
      handleZoom(delta, posX, posY);
    }
    zoomed = false;
    return evt.preventDefault() && false;
  };

  const limitOrinPos = () => {
    const zoomScale = Math.pow(1.15, countMul);
    const limiw = (100 * (zoomScale - 1)) / zoomScale;
    const limih =
      (100 * (zoomScale * canvasSize.w - canvasSize.h)) /
      (zoomScale * canvasSize.w);
    orinPos.x = orinPos.x < 0 ? 0 : orinPos.x;
    orinPos.y = orinPos.y < 0 ? 0 : orinPos.y;
    if (canvasWidth > canvasHeight) {
      orinPos.x = orinPos.x > limiw ? limiw : orinPos.x;
      orinPos.y = orinPos.y > limih ? limih : orinPos.y;
    } else if (canvasWidth < canvasHeight) {
      orinPos.x = orinPos.x > limih ? limih : orinPos.x;
      orinPos.y = orinPos.y > limiw ? limiw : orinPos.y;
    }
  };

  const handleZoom = (delta: any, posX: any, posY: any) => {
    if (!zoomed) return;
    let deltaFact = 1;
    if (delta > 0) {
      deltaFact = 1.15;
      setCanvasCursor("zoom-in");
      if (countMul >= 25) {
        countMul = 25;
        return;
      }
      countMul++;
    } else if (delta < 0) {
      setCanvasCursor("zoom-out");
      deltaFact = 1 / 1.15;
      if (countMul <= 0) {
        countMul = 0;
        return;
      }
      countMul--;
    }
    const zoomScale = Math.pow(1.15, countMul);
    orinPos.x += ((deltaFact - 1) * posX) / zoomScale;
    orinPos.y += ((deltaFact - 1) * posY) / zoomScale;
    limitOrinPos();

    curPos.x = orinPos.x + posX / zoomScale;
    curPos.y = orinPos.y + posY / zoomScale;
    localStorage.setItem("curPoint", JSON.stringify(curPos));
    handleDrawCanvas();
  };

  const handleDrag = (
    orinX: any,
    orinY: any,
    posX: any,
    posY: any,
    lastX: any,
    lastY: any
  ) => {
    setCanvasCursor("grabbing");
    const zoomScale = Math.pow(1.15, countMul);
    const dx = (posX - lastX) / zoomScale;
    const dy = (posY - lastY) / zoomScale;

    orinPos.x = orinX - dx;
    orinPos.y = orinY - dy;
    limitOrinPos();
    curPos.x = orinPos.x + posX / zoomScale;
    curPos.y = orinPos.y + posY / zoomScale;
    localStorage.setItem("curPoint", JSON.stringify(curPos));
    handleDrawCanvas();
  };

  handleAnimation();

  function handleAnimation() {
    requestAnimationFrame(handleAnimation);
    drawDerivative();
  }

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const initEventListners = () => {
    window.addEventListener("resize", updateSize);

    const canvas: any = canvasRef2.current;
    const particle: any = document.getElementById("particleDiv");
    if (canvas && particle) {
      let lastX = 0;
      let lastY = 0;
      let distZoom = 0;
      let orin = { x: 0, y: 0 };
      let dragged = true;
      let cnt = 20;
      canvas.addEventListener(
        "touchstart",
        function touchEventHandler(evt: any) {
          evt.preventDefault();
          if (evt.targetTouches.length === 2 && !zoomed) {
            const touch1: any = evt.touches[0];
            const touch2: any = evt.touches[1];
            if (touch1 && touch2) {
              distZoom = Math.hypot(
                touch1.pageX - touch2.pageX,
                touch1.pageY - touch2.pageY
              );
              zoomed = true;
            }
          } else if (evt.targetTouches.length === 1) {
            zoomed = false;
            const touch: any = evt.targetTouches[0];
            if (touch) {
              const offsetX =
                ((touch.clientX - touch.target.offsetLeft) / canvasSize.w) *
                100;
              const offsetY =
                ((touch.clientY - touch.target.offsetTop) / canvasSize.w) * 100;
              lastX = offsetX;
              lastY = offsetY;
              orin.x = orinPos.x;
              orin.y = orinPos.y;
              isDown = true;
              cnt = countMul;
            }
          }
        },
        false
      );
      canvas.addEventListener(
        "touchmove",
        function touchEventHandler(evt: any) {
          evt.preventDefault();
          dragged = true;
          if (
            evt.targetTouches.length === 2 &&
            evt.changedTouches.length === 2 &&
            zoomed
          ) {
            const touch1: any = evt.touches[0];
            const touch2: any = evt.touches[1];
            if (touch1 && touch2) {
              const distZoom2 = Math.hypot(
                touch1.pageX - touch2.pageX,
                touch1.pageY - touch2.pageY
              );
              cnt = countMul;
              const offsetX =
                (((touch1.clientX + touch2.clientX) / 2 -
                  touch1.target.offsetLeft) /
                  canvasSize.w) *
                100;
              const offsetY =
                (((touch1.clientY + touch2.clientY) / 2 -
                  touch1.target.offsetTop) /
                  canvasSize.w) *
                100;
              if (distZoom > distZoom2) {
                if (countMul <= 0) {
                  cnt = -50;
                } else {
                  zoomtimed = false;
                  handleZoom(-3, offsetX, offsetY);
                }
              } else if (distZoom < distZoom2) {
                if (countMul >= 25) {
                  cnt = 100;
                } else {
                  zoomtimed = true;
                  handleZoom(3, offsetX, offsetY);
                }
              }
            }
          } else if (
            evt.targetTouches.length === 1 &&
            evt.changedTouches.length === 1
          ) {
            zoomed = false;
            const touch: any = evt.changedTouches[0];
            if (touch && isDown) {
              const offsetX =
                ((touch.clientX - touch.target.offsetLeft) / canvasSize.w) *
                100;
              const offsetY =
                ((touch.clientY - touch.target.offsetTop) / canvasSize.w) * 100;
              handleDrag(orin.x, orin.y, offsetX, offsetY, lastX, lastY);
            }
          }
        },
        false
      );
      canvas.addEventListener(
        "touchend",
        function touchEventHandler(evt: any) {
          evt.preventDefault();
          if (evt.changedTouches.length === 1) {
            const touch: any = evt.changedTouches[0];
            if (touch && !dragged && cnt === countMul) {
              const zoomScale = Math.pow(1.15, countMul);
              const offsetX =
                ((touch.clientX - touch.target.offsetLeft) / canvasSize.w) *
                100;
              const offsetY =
                ((touch.clientY - touch.target.offsetTop) / canvasSize.w) * 100;
              curPos.x = orinPos.x + offsetX / zoomScale;
              curPos.y = orinPos.y + offsetY / zoomScale;
              localStorage.setItem("curPoint", JSON.stringify(curPos));
              drawPointerOutLine();
              const curJson = localStorage.getItem("curPoint");
              if (curJson) {
                const _curPoint = JSON.parse(curJson);
                setClickedX(Math.ceil(_curPoint.x));
                setClickedY(Math.ceil(_curPoint.y));
                setIsOpenModal(true);
              }
            }
          }
          isDown = false;
          dragged = false;
          zoomed = false;
        },
        false
      );
      particle.addEventListener(
        "mousedown",
        function (evt: any) {
          const offsetX = Math.ceil((evt.offsetX / canvasSize.w) * 100);
          const offsetY = Math.ceil((evt.offsetY / canvasSize.w) * 100);

          lastX = offsetX;
          lastY = offsetY;
          orin.x = orinPos.x;
          orin.y = orinPos.y;
          isDown = true;
        },
        false
      );
      particle.addEventListener(
        "mouseup",
        function (evt: any) {
          if (!dragged) {
            const curJson = localStorage.getItem("curPoint");
            if (curJson) {
              const _curPoint = JSON.parse(curJson);
              setClickedX(Math.ceil(_curPoint.x));
              setClickedY(Math.ceil(_curPoint.y));
              setIsOpenModal(true);
            }
          }
          isDown = false;
          dragged = false;
          setCanvasCursor("pointer");
        },
        false
      );
      particle.addEventListener(
        "mousemove",
        function (evt: any) {
          if (!isDown) {
            const curJson = localStorage.getItem("curPoint");
            if (curJson) {
              const zoomScale = Math.pow(1.15, countMul);
              const offsetX = (evt.offsetX / canvasSize.w) * 100;
              const offsetY = (evt.offsetY / canvasSize.w) * 100;
              curPos.x = orinPos.x + offsetX / zoomScale;
              curPos.y = orinPos.y + offsetY / zoomScale;
              const _curPoint = JSON.parse(curJson);
              const curX = Math.ceil(_curPoint.x);
              const curY = Math.ceil(_curPoint.y);
              if (
                Math.ceil(curPos.x) === curX &&
                Math.ceil(curPos.y) === curY
              ) {
                setCanvasCursor("pointer");
              } else {
                localStorage.setItem("curPoint", JSON.stringify(curPos));
                drawPointerOutLine();
                setCanvasCursor("pointer");
              }
            }
          } else {
            const offsetX = (evt.offsetX / canvasSize.w) * 100;
            const offsetY = (evt.offsetY / canvasSize.w) * 100;
            dragged = true;
            handleDrag(orin.x, orin.y, offsetX, offsetY, lastX, lastY);
          }
        },
        false
      );
      particle.addEventListener("DOMMouseScroll", handleScroll, false);
      particle.addEventListener("mousewheel", handleScroll, false);
    }
  };

  useEffect(() => {
    initEventListners();
    handleInit();
  }, []);

  return (
    <>
      <Box
        border="solid 1px"
        display="flex"
        alignItems="center"
        cursor={canvasCursor}
      >
        <canvas
          ref={canvasRef1}
          id="lay01"
          width={`${canvasWidth}`}
          height={`${canvasHeight}`}
        ></canvas>
        <canvas
          ref={canvasRef2}
          id="lay02"
          width={`${canvasWidth}`}
          height={`${canvasHeight}`}
        ></canvas>
        <ParticleDiv divid="particleDiv" strMove={strMove} valSize={valSize} />
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
