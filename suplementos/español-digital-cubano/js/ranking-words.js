/* <div class="word-list">
<div class="total-tag">Total</div>
${list_words[0]
  .map((x, i) => `<div class="word-${i + 1}">${x}</div>`)
  .join(" ")}
</div> */

// function mark(key, list_words) {
//   var listDom = document.getElementById(most-frequency-word);
//   listDom.innerHTML = `
//     <div class="flex">
//       <div class="word-list">
//         <div class="total-tag">CubaDebate</div>
//         ${list_words[1]
//           .map((x, i) => `<div class="word-${i + 1}">${x}</div>`)
//           .join(" ")}
//       </div>
//       <div class="word-list">
//         <div class="total-tag">Facebook</div>
//         ${list_words[2]
//           .map((x, i) => `<div class="word-${i + 1}">${x}</div>`)
//           .join(" ")}
//       </div>
//       <div class="word-list">
//         <div class="total-tag">Telegram</div>
//         ${list_words[3]
//           .map((x, i) => `<div class="word-${i + 1}">${x}</div>`)
//           .join(" ")}
//       </div>
//       <div class="word-list">
//         <div class="total-tag">Twitter</div>
//         ${list_words[4]
//           .map((x, i) => `<div class="word-${i + 1}">${x}</div>`)
//           .join(" ")}
//       </div>
//       <div class="word-list">
//         <div class="total-tag">Youtube</div>
//         ${list_words[5]
//           .map((x, i) => `<div class="word-${i + 1}">${x}</div>`)
//           .join(" ")}
//       </div>

//     </div>`;
// }

function read(f) {
  let obj = {};
  return $.getJSON("data/words0.json", function (data) {
    obj = Object.assign(obj, data);
    $.getJSON("data/words1.json", function (data) {
      obj = Object.assign(obj, data);
      $.getJSON("data/words2.json", function (data) {
        obj = Object.assign(obj, data);
        $.getJSON("data/words3.json", function (data) {
          obj = Object.assign(obj, data);
          $.getJSON("data/words4.json", function (data) {
            obj = Object.assign(obj, data);
            $.getJSON("data/words5.json", function (data) {
              obj = Object.assign(obj, data);
              $.getJSON("data/words6.json", function (data) {
                obj = Object.assign(obj, data);
                $.getJSON("data/words7.json", function (data) {
                  obj = Object.assign(obj, data);
                  $.getJSON("data/words8.json", function (data) {
                    obj = Object.assign(obj, data);
                    $.getJSON("data/words9.json", function (data) {
                      obj = Object.assign(obj, data);
                      $.getJSON("data/words10.json", function (data) {
                        obj = Object.assign(obj, data);
                        return f(obj);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function getTen(data, filter) {
  const result = data.filter((x) => filter(x)).map((x) => x.text);

  if (result.length > 10) return result.slice(0, 10);

  return result.concat(Array(10 - result.length).fill("-"));
}

function filter(data, filter) {
  const realData = data
    .filter((x) => filter(x))
    .sort((a, b) => (a.frequency < b.frequency ? 1 : -1));

  return [
    getTen(realData, (x) => true),
    getTen(realData, (x) => x.social_network.includes("CubaDebate")),
    getTen(realData, (x) => x.social_network.includes("Facebook")),
    getTen(realData, (x) => x.social_network.includes("Telegram")),
    getTen(realData, (x) => x.social_network.includes("Twitter")),
    getTen(realData, (x) => x.social_network.includes("Youtube")),
  ];
}

function listFormation(data, index, func) {
  let mask = 0;
  const cu = [],
    fb = [],
    tg = [],
    tw = [],
    yt = [];
  let i = func(index);
  const breakCond = 1 + 2 + 4 + 8 + 16;
  while (mask != breakCond && i > -1 && i < data.length) {
    if (!(mask & (1 << 0)) && data[i].social_network.includes("CubaDebate")) {
      cu.push(`🔝${data[i].globalRanking} - ${data[i].text}`);
      if (cu.length === 4) mask = mask | (1 << 0);
    }

    if (!(mask & (1 << 1)) && data[i].social_network.includes("Facebook")) {
      // fb.push(data[i].text);
      fb.push(`🔝${data[i].globalRanking} - ${data[i].text}`);

      if (fb.length === 4) mask = mask | (1 << 1);
    }

    if (!(mask & (1 << 2)) && data[i].social_network.includes("Telegram")) {
      // tg.push(data[i].text);
      tg.push(`🔝${data[i].globalRanking} - ${data[i].text}`);
      if (tg.length === 4) mask = mask | (1 << 2);
    }

    if (!(mask & (1 << 3)) && data[i].social_network.includes("Twitter")) {
      // tw.push(data[i].text);
      tw.push(`🔝${data[i].globalRanking} - ${data[i].text}`);
      if (tw.length === 4) mask = mask | (1 << 3);
    }

    if (!(mask & (1 << 4)) && data[i].social_network.includes("Youtube")) {
      // yt.push(data[i].text);
      yt.push(`🔝${data[i].globalRanking} - ${data[i].text}`);
      if (yt.length === 4) mask = mask | (1 << 4);
    }

    i = func(i);
  }

  return [cu, fb, tg, tw, yt];
}

function index(data, value) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].text === value.toLowerCase()) {
      return [i, data[i]];
    }
  }

  return [-1, undefined];
}

const styleSequence = [8, 6, 5, 4, 1, 4, 5, 6, 8];
const notFoundArray = Array(9).fill("-");
const faker = {
  frequency: {
    Total: "-",
  },
  globalRanking: "-",
  social_network: [],
};

notFoundArray[4] = "No aparece";

function change(data, item) {
  return () => {
    let [i, obj] = index(data, item.value);
    if (!obj) obj = faker;

    const next = listFormation(data, i, (x) => x + 1).map((l) =>
      l.concat(Array(4 - l.length).fill("-"))
    );

    console.lo;
    const previous = listFormation(data, i, (x) => x - 1).map((l) =>
      l.concat(Array(4 - l.length).fill("-")).reverse()
    );

    var html = document.getElementById("ranking");
    html.innerHTML = `
    <label class="word-2">Aparece: ${obj.frequency.Total} veces</label>
    <label class="word-2">Ocupa el puesto ${obj.globalRanking} en el ranking global</label>
    `;

    var listDom = document.getElementById("most-frequency-word");
    listDom.innerHTML = `
        <div class="flex">
          <div class="word-list">
            <div class="total-tag">CubaDebate</div>
            ${(obj.social_network.includes("CubaDebate")
              ? previous[0].concat([obj.text].concat(next[0]))
              : notFoundArray
            )
              .map((x, i) => `<div class="word-${styleSequence[i]}">${x}</div>`)
              .join(" ")}
          </div>
          <div class="word-list">
            <div class="total-tag">Facebook</div>
            ${(obj.social_network.includes("Facebook")
              ? previous[1].concat([obj.text].concat(next[1]))
              : notFoundArray
            )
              .map((x, i) => `<div class="word-${styleSequence[i]}">${x}</div>`)
              .join(" ")}
          </div>
          <div class="word-list">
            <div class="total-tag">Telegram</div>
            ${(obj.social_network.includes("Telegram")
              ? previous[2].concat([obj.text].concat(next[2]))
              : notFoundArray
            )
              .map((x, i) => `<div class="word-${styleSequence[i]}">${x}</div>`)
              .join(" ")}
          </div>
          <div class="word-list">
            <div class="total-tag">Twitter</div>
            ${(obj.social_network.includes("Twitter")
              ? previous[3].concat([obj.text].concat(next[3]))
              : notFoundArray
            )
              .map((x, i) => `<div class="word-${styleSequence[i]}">${x}</div>`)
              .join(" ")}
          </div>
          <div class="word-list">
            <div class="total-tag">Youtube</div>
            ${(obj.social_network.includes("Youtube")
              ? previous[4].concat([obj.text].concat(next[4]))
              : notFoundArray
            )
              .map((x, i) => `<div class="word-${styleSequence[i]}">${x}</div>`)
              .join(" ")}
          </div>

        </div>`;
  };
}

read(function (data) {
  const totalData = Object.keys(data)
    .map((key) => {
      const result = data[key];
      result.text = key;
      return result;
    })
    .filter(
      (x) =>
        (!x.is_stop && x.is_natural_word) ||
        x.is_emoji ||
        x.is_user ||
        x.is_hashtag
    )
    .sort((a, b) => (a.globalRanking < b.globalRanking ? -1 : 1));

  console.log("Init Word Ranking");
  var input = document.getElementById("super-word");

  change(totalData, input)();
  input.onchange = change(totalData, input);

  // mark(
  //   "most-frequency-not-eth-word",
  //   filter(totalData, (x) => x.is_natural_word && !x.origin_key)
  // );

  // mark(
  //   "most-frequency-emojis",
  //   filter(totalData, (x) => x.is_emoji)
  // );

  // mark(
  //   "most-frequency-users",
  //   filter(totalData, (x) => x.is_user)
  // );

  // mark(
  //   "most-frequency-hastags",
  //   filter(totalData, (x) => x.is_hashtag)
  // );
});
