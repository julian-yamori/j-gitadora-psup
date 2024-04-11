// eslint-disable-next-line @typescript-eslint/no-unused-expressions
async (urlPrefix: string, auth: string) => {
  function readTrackElement(trackElement: Element) {
    return [
      elemGetText(trackElement.querySelector(".title")),
      elemGetText(
        trackElement.querySelector(
          ".sr_data_score_tb tr:nth-child(10) .score_data",
        ),
      ),
    ];
  }

  function elemGetText(element: Element | null): string {
    if (element === null) {
      throw new Error("element is null");
    }

    const text = element?.textContent;
    if (text === null) {
      throw new Error("text is null");
    }

    return text.trim();
  }

  let success = "0";

  try {
    const trackElements = document.querySelectorAll(".sr_list_tb");
    if (trackElements.length === 0) {
      throw Error("history not found");
    }

    const info = [...trackElements.values()].map(readTrackElement);

    const postUrl = new URL("api/load_ohp_history", urlPrefix);
    await fetch(postUrl, {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        Authorization: auth,
      },
    });

    success = "1";
  } finally {
    const resultSearchParams = new URLSearchParams({ success });
    const resultUrl = new URL(
      `load_ohp_history/result?${resultSearchParams.toString()}`,
      urlPrefix,
    );
    window.open(resultUrl);
  }
};
