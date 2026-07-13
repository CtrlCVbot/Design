# Unsafe fixture

```ts
const reportName = request.body.reportName;
runShell(`report ${reportName}`);

const preview = request.query.preview;
previewElement.innerHTML = preview;
```

This is reviewable command-injection and XSS evidence, not a confirmed vulnerability assertion.
