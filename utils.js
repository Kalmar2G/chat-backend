const minL = 25; const maxL = 65;
const maxHex = 16777215;

const getHEXByHSL = (h, l) => {
  const hexL = l / 100;
  const a = (100 * Math.min(hexL, 1 - hexL)) / 100;
  const foo = (n) => {
    const k = (n + h / 30) % 12;
    const color = hexL - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${foo(0)}${foo(8)}${foo(4)}`;
};

const getHEXColor = (a, b, c) => {
  const h = Math.floor((parseInt(a, 16) / maxHex) * 360); // 0-360 градусов цвета
  const l = Math.floor((parseInt(c, 16) / maxHex) * (maxL - minL) + minL); // 70-100% яркости
  return getHEXByHSL(h, l);
};

const getUserInfo = (userData) => {
  const { text, event, username } = userData;
  const color = getHEXColor(
    username.substring(0, 6),
    username.substring(6, 12),
    username.substring(12, 18),
  );
  return {
    text,
    event,
    username,
    color,
  };
};

module.exports = {
  getHEXColor,
  getUserInfo,
};
