let cli = "";
let imgrpxR = "";
wx.getSystemInfo({
  success: function (res) {
    let clientHeight = res.windowHeight,
      clientWidth = res.windowWidth,
      rpxR = 750 / clientWidth;
    let calc = clientHeight * rpxR - 80;
    cli = calc;
    imgrpxR = rpxR;
  },
});
module.exports = {
  calc: cli,
  rpxR: imgrpxR
}
