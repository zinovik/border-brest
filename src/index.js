const functions = require("@google-cloud/functions-framework");

const getDate = (daysShift) =>
  new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * daysShift);

const formatDate = (date) =>
  `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${date.getFullYear()}`;

const getFormattedDates = () =>
  [-6, -5, -4, -3, -2, -1, 0, 1].map((daysShift) =>
    formatDate(getDate(daysShift))
  );

const getBorderLinesForDate = async (formattedDate) => {
  const response = await fetch(
    "https://gpk.gov.by/local/ajax/order-archive.php",
    {
      method: "POST",
      headers: {
        Referer: "https://gpk.gov.by/situation-at-the-border/arkhiv-ocheredey/",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `ppr=brest&date=${formattedDate}`,
    }
  );

  lines = await response.json();

  return lines.ITEMS.map((item) => ({
    date: formattedDate,
    time: item.NAME.split(" ")[1],
    cars: item.PROPERTY_BREST_OUT_L_VALUE,
    buses: item.PROPERTY_BREST_OUT_A_VALUE,
  }));
};

const formatBorderLines = (borderLines) => {
  const borderLinesFormatted = [...borderLines.reverse()].reduce(
    (acc, borderLinesForDate) => {
      if (borderLinesForDate.length === 0) return acc;

      const borderLinesForDateFormatted = `
            <h4>${borderLinesForDate[1].date}</h4>
            ${[...borderLinesForDate.reverse()]
              .map(
                (borderLinesForTime) =>
                  `<div><strong>${borderLinesForTime.time}</strong> | ${borderLinesForTime.cars} cars / ${borderLinesForTime.buses} buses</div>`
              )
              .join("\n")}
        `;

      return acc + borderLinesForDateFormatted;
    },
    ""
  );

  return `<!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#FFFFFF" />
          <meta name="description" content="Border Brest"/>
          <style>body { font-size: 150%; }</style>
      </head>
      <body><h3>Border Brest</h3>${borderLinesFormatted}</body>
  </html>`;
};

functions.http("main", async (_req, res) => {
  console.log("Triggered!");

  const borderLines = await Promise.all(
    getFormattedDates().map((date) => getBorderLinesForDate(date))
  );
  const response = formatBorderLines(borderLines);

  console.log("Done!");

  res.status(200).send(response);
});
