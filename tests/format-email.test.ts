import { describe, expect, it } from "vitest";
import { formatContactEmail } from "@/lib/contact/format-email";

const submission = {
  name: "Jane Recruiter",
  email: "jane@example.com",
  message: "Line one\nLine two",
};

describe("formatContactEmail", () => {
  it("includes the sender name in the subject", () => {
    const email = formatContactEmail(submission);
    expect(email.subject).toBe("Portfolio contact — Jane Recruiter");
  });

  it("renders newlines as <br> in html", () => {
    const email = formatContactEmail(submission);
    expect(email.html).toContain("Line one<br>Line two");
  });

  it("preserves newlines in the plain-text body", () => {
    const email = formatContactEmail(submission);
    expect(email.text).toContain("Line one\nLine two");
  });

  it("escapes HTML in name, email, and message", () => {
    const email = formatContactEmail({
      name: '<script>alert(1)</script>',
      email: "jane@example.com",
      message: "5 < 10 && 10 > 5",
    });
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).toContain("5 &lt; 10 &amp;&amp; 10 &gt; 5");
  });
});
