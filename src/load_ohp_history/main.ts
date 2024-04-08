// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const trackElements = document.querySelectorAll(".sr_list_tb");

  window.alert(`.sr_list_tb x${trackElements.length}`);
})();

// function readTrackElement(trackElement: Element): {title: string, achievement: number} {
//   trackElement.querySelector(".title");
//   trackElement.querySelector(".sr_data_score_tb tr:nth-child(9) score_data");
// }
