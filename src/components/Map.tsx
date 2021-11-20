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

  const [clickedX, setClickedX] = useState(30);
  const [clickedY, setClickedY] = useState(20);
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
    canvasHeight > canvasWidth
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
        else msg = "Transaction can't be performed.";
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
    if (canvasHeight > canvasWidth) {
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
      ctx.strokeRect(
        Math.ceil(_curPoint.x) - 0.95,
        Math.ceil(_curPoint.y) - 0.95,
        0.9,
        0.9
      );
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
          img.src = imgsrc;
          ctx.drawImage(img, x - 1, y - 1, 1, 1);
        }
      }
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

  const handleDrawCanvas = () => {
    const zoomScale = (Math.pow(1.15, countMul) * canvasSize.w) / 100;
    const canvas: any = canvasRef.current;
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
    initEventListners();
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
    try {
      if (
        collectionID === "0" ||
        collectionID === "1" ||
        collectionID === "2" ||
        collectionID === "3" ||
        collectionID === "139" ||
        collectionID === "140" ||
        collectionID === "141"
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
      if (countMul >= 25) {
        countMul = 25;
        return;
      }
      countMul++;
    } else if (delta < 0) {
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

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const initEventListners = () => {
    window.addEventListener("resize", updateSize);

    const canvas: any = canvasRef.current;
    if (canvas) {
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
          } else if (
            evt.targetTouches.length === 1 &&
            evt.changedTouches.length === 1
          ) {
            zoomed = false;
            const touch: any = evt.changedTouches[0];
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
              const ctx = canvas.getContext("2d");
              const zoomScale = Math.pow(1.15, countMul);
              const offsetX =
                ((touch.clientX - touch.target.offsetLeft) / canvasSize.w) *
                100;
              const offsetY =
                ((touch.clientY - touch.target.offsetTop) / canvasSize.w) * 100;
              curPos.x = orinPos.x + offsetX / zoomScale;
              curPos.y = orinPos.y + offsetY / zoomScale;
              localStorage.setItem("curPoint", JSON.stringify(curPos));
              draw(ctx);
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
      canvas.addEventListener(
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
      canvas.addEventListener(
        "mouseup",
        function (evt: any) {
          if (!isMobile && !dragged) {
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
        },
        false
      );
      canvas.addEventListener(
        "mousemove",
        function (evt: any) {
          if (!isDown) {
            const ctx = canvas.getContext("2d");
            const zoomScale = Math.pow(1.15, countMul);
            const offsetX = (evt.offsetX / canvasSize.w) * 100;
            const offsetY = (evt.offsetY / canvasSize.w) * 100;
            curPos.x = orinPos.x + offsetX / zoomScale;
            curPos.y = orinPos.y + offsetY / zoomScale;
            draw(ctx);
            localStorage.setItem("curPoint", JSON.stringify(curPos));
          } else {
            const offsetX = (evt.offsetX / canvasSize.w) * 100;
            const offsetY = (evt.offsetY / canvasSize.w) * 100;
            dragged = true;
            handleDrag(orin.x, orin.y, offsetX, offsetY, lastX, lastY);
          }
        },
        false
      );
      canvas.addEventListener("DOMMouseScroll", handleScroll, false);
      canvas.addEventListener("mousewheel", handleScroll, false);
    }
  };

  useEffect(() => {
    handleInit();
  }, []);

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
