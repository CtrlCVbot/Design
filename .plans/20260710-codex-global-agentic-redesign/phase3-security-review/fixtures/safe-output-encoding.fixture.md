# Safe fixture

```ts
const reportName = validateReportName(request.body.reportName);
runProcess("report", [reportName]);

const preview = String(request.query.preview ?? "");
previewElement.textContent = preview;
```

This is not an assertion that a vulnerability exists.
