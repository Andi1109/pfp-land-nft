import { useRef, useState, useEffect } from "react";
import { Box, Flex, Text, Button, SimpleGrid } from "@chakra-ui/react";
import { GetClaimedLandOf, useContractMethod } from "../hooks";
import collectionBordersJson from "../borders/CollectionBorders.json";
import collectionTitlesJson from "../borders/CollectionTitles.json";
import tierBordersJson from "../borders/TierBorders.json";
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";

export default function Map() {
  // const { account } = useEthers();
  // const claimedLand = GetClaimedLandOf(account);
  // const tmp = DecodeTokenID("340282366920938463463374607431768211556");

  // const [claimedLandValue, setClaimedLandValue] = useState(0);

  // useEffect(() => {
  //   setClaimedLandValue(claimedLand ? claimedLand.toNumber() : 0);
  //   // console.log(claimedLandValue);
  // }, [claimedLand]);

  const canvasRef = useRef(null);

  const drawTiers = (ctx: any) => {
    for (let i = 0; i < tierBordersJson.length; i++) {
      if (i == 0) ctx.fillStyle = "rgba(128, 0, 128, 1)";
      else if (i == 1) ctx.fillStyle = "rgba(0, 100, 235, 1)";
      else if (i == 2) ctx.fillStyle = "rgba(0, 200, 0, 1)";
      else ctx.fillStyle = "rgba(230, 230, 0, 1)";

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

  const draw = (ctx: any) => {
    const canvasHeight = Math.round(window.innerHeight / (100 / 90));
    ctx.scale(canvasHeight / 100, canvasHeight / 100);
    drawTiers(ctx);
    drawLandBorders(ctx);
    drawCollectionBorders(ctx);
    drawCollectionTitles(ctx);
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const canvasHeight = Math.round(window.innerHeight / (100 / 90));
    canvas.setAttribute("width", canvasHeight + "px");
    canvas.setAttribute("height", canvasHeight + "px");
    if (canvas) {
      const context = canvas.getContext("2d");
      draw(context);
    }
  }, [draw]);

  return (
    <Box width="90vh" height="90vh" margin="auto" border="solid 1px">
      <canvas ref={canvasRef} width="90vh" height="90vh" />
    </Box>
  );
}
