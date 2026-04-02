const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'admin', 'websites', '[id]', 'edit', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the start of the old return block
const oldStart = content.indexOf('return (\r\n    <div className="max-w-4xl mx-auto space-y-6">');
if (oldStart === -1) {
  console.log('ERROR: Could not find old block');
  process.exit(1);
}

// Find the end of the file (everything after the return) - find the last '}' + newline
const oldEnd = content.lastIndexOf('\r\n}\r\n');
if (oldEnd === -1) {
  console.log('ERROR: Could not find end of file');
  process.exit(1);
}

console.log('Old block starts at:', oldStart);
console.log('Old block ends at:', oldEnd + 3);
console.log('Old block preview:', content.substring(oldStart, oldStart + 80));

const newReturnBlock = `  return (
    <div className="bg-gradient-to-b from-[#FFF7FB] to-[#FDF2F8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Edit Website</h1>
            <p className="text-slate-500 mt-1 text-sm lg:text-base">Update your website configuration</p>
          </div>
          <a href="/admin/websites" className="text-rose-600 hover:text-rose-700 font-medium text-sm">
            ← Back to Websites
          </a>
        </div>

        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobilePreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-slate-700 font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Live Preview
          </button>
        </div>

        <div className="mb-6">
          <EditStepNav
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={(step) => {
              if (step < currentStep || completedSteps.includes(step - 1)) {
                setCurrentStep(step);
                setError(null);
              }
            }}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        {warning && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl">
            {warning}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <form onSubmit={handleFormSubmit}>
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    {currentStep === 5 ? 'Next: Review' : 'Continue'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <LivePreview
            occasion={form.occasion}
            config={config}
            coupleNames={{
              customer_name: form.participants?.[0]?.name ?? form.customer_name ?? '',
              partner_name: form.participants?.[1]?.name ?? form.partner_name ?? '',
            }}
            tagline={form.tagline}
            message={form.message}
            specialDate={form.specialDate}
            isMobileOpen={mobilePreviewOpen}
            onMobileClose={() => setMobilePreviewOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
`;

const newContent = content.substring(0, oldStart) + newReturnBlock;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('SUCCESS: File updated');
console.log('New file length:', newContent.length);
