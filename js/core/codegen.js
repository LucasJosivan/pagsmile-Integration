export const CONTENT_TYPE = "application/json; charset=UTF-8";

function withContentType(headers) {
  return { "Content-Type": CONTENT_TYPE, ...headers };
}

export function buildCurl({ url, headers, body }) {
  const allHeaders = withContentType(headers);
  const headerLines = Object.entries(allHeaders)
    .map(([k, v]) => `  -H "${k}: ${v}"`)
    .join(" \\\n");
  const bodyJson = JSON.stringify(body, null, 2);
  return `curl -X POST "${url}" \\\n${headerLines} \\\n  -d '${bodyJson}'`;
}

export function buildGoSnippet({ url, headers, body }) {
  const allHeaders = withContentType(headers);
  const headerLines = Object.entries(allHeaders)
    .map(([k, v]) => `\treq.Header.Set(${JSON.stringify(k)}, ${JSON.stringify(v)})`)
    .join("\n");
  const bodyJson = JSON.stringify(body, null, 2);
  return `package main

import (
\t"bytes"
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\turl := ${JSON.stringify(url)}
\tpayload := []byte(\`${bodyJson}\`)

\treq, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
\tif err != nil {
\t\tpanic(err)
\t}
${headerLines}

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\trespBody, _ := io.ReadAll(resp.Body)
\tfmt.Println(resp.StatusCode)
\tfmt.Println(string(respBody))
}
`;
}

export function buildNodeSnippet({ url, headers, body }) {
  const allHeaders = withContentType(headers);
  const headersJs = JSON.stringify(allHeaders, null, 2).replace(/^/gm, "  ").trim();
  const bodyJs = JSON.stringify(body, null, 2);
  return `const response = await fetch(${JSON.stringify(url)}, {
  method: "POST",
  headers: ${indent(headersJs, 2)},
  body: JSON.stringify(${indent(bodyJs, 2)}),
});

const data = await response.json();
console.log(response.status, data);
`;
}

export function buildPythonSnippet({ url, headers, body }) {
  const allHeaders = withContentType(headers);
  const headersPy = JSON.stringify(allHeaders, null, 4);
  const bodyJson = JSON.stringify(body, null, 2);
  return `import json
import requests

url = ${JSON.stringify(url)}
headers = ${headersPy}
payload = json.loads(r'''
${bodyJson}
''')

response = requests.post(url, headers=headers, json=payload)
print(response.status_code)
print(response.json())
`;
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line, i) => (i === 0 ? line : pad + line))
    .join("\n");
}
