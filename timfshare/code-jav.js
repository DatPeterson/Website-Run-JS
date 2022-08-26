REG_MOVIE_EXTENSIONS =
  /[.](avi|mpg|mpe|mpeg|asf|wmv|mov|qt|rm|mp4|flv|m4v|webm|ogv|ogg|mkv|ts|tsv)/;
PAGESIZE = 10;
CODES = `567BEAF	BEAF
546EROF	EROF
300NTK	NTK
300MIUM	MIUM
300MAAN	MAAN
200GANA	GANA`
CODES = CODES.toLowerCase()
  .split('\n')
  .filter((code) => code);

async function recursion(PAGE = 0) {
  if (PAGE * PAGESIZE > CODES.length) return;
  arr = [];
  values = await Promise.all(
    CODES.slice(PAGE * PAGESIZE, (PAGE + 1) * PAGESIZE).map((item) =>
      fetch('https://api.timfshare.com/v1/string-query-search?query=' + item.split('\t')[0], {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiZnNoYXJlIiwidXVpZCI6IjcxZjU1NjFkMTUiLCJ0eXBlIjoicGFydG5lciIsImV4cGlyZXMiOjAsImV4cGlyZSI6MH0.WBWRKbFf7nJ7gDn1rOgENh1_doPc07MNsKwiKCJg40U',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://timfshare.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      }).then((response) => response.json())
    )
  ).then((result) => {
    result.forEach((child, order) => {
    input = CODES[order + PAGE * PAGESIZE].toUpperCase().split('\t');
    searchKey = input?.[0] || input
      code =  input?.[1]|| input
      child.data.forEach(({ id, name }) => {
        try {
          const text = name.toLowerCase();
          if (REG_MOVIE_EXTENSIONS.test(text)) {
            codeExtracted = text.match(
              new RegExp(`${searchKey}(-| |_|)[0-9]{2,}`, 'gi')
            );
            if (Array.isArray(codeExtracted)) {
              extracted = codeExtracted[0].replaceAll(
                new RegExp(searchKey + '(-| |_|)', 'gi'),
                code + '-'
              );

              arr = [...new Set([...arr, `${extracted.replace()}\t${name}\t${id}\t`])];
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
  });
  download('test', arr.join('\n') + '\n');
  await recursion(PAGE + 1);
}

(async () => console.log(recursion(0)))();

function genCode(code = 'star') {
  text =
    Array(10)
      .fill(code)
      .map(
        (code, index) =>
          `${code}-${index} ${code}_${index} ${code}${index} ${code}00${index}`
      )
      .join(' ') + ` ${code}0000 ${code}`;
  return (text || '').split(' ');
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute(
    'download',
    new Date().getTime() + ' ' + filename + '.txt'
  );
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
