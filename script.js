// ============================================================
// MILESTONE 2: State switching
// All state is controlled by toggling 'result-mode' on document.body.
// CSS does all the showing/hiding. JS only adds or removes that class.
// ============================================================


// --- MOCK RESPONSES ---
// These simulate what the AI would return for each tool.
// In a future milestone, this gets replaced with a real API call.
const mockResponses = {
  'Summarize': 'The provided text examines the topic from multiple angles, highlighting key themes such as cause, effect, and context. The author builds a case by introducing the core problem, exploring its underlying factors, and concluding with a clear position. The overall argument is structured and coherent, though some supporting claims would benefit from further evidence.',

  'Explain': 'Let\'s break this down into simpler parts.\n\nFirst, the core idea: the text is making a case for something — whether that\'s a concept, an argument, or a process. It builds its point by introducing the problem, exploring its causes, and suggesting what could be done.\n\nSecond, the structure: the author moves from general observations toward specific examples. This is a common writing pattern designed to make abstract ideas feel concrete.\n\nThird, the key takeaway: understanding this topic fully requires looking at it from more than one angle. The text does this reasonably well, though some sections assume prior knowledge the reader may not have.',

  'Quiz': 'Here are 3 questions based on your text:\n\n1. What is the central argument or main idea the author is presenting? Try to state it in one sentence.\n\n2. What evidence or examples does the author use to support their position? Are those examples convincing?\n\n3. What is one assumption the author makes that could be questioned or challenged? How would the argument change if that assumption were wrong?',

  'Rewrite': 'Here is a cleaner, more direct version of your text:\n\nThe subject at hand is more layered than it initially appears. A surface reading points toward a clear conclusion, but closer examination reveals important nuance. The key factors include the assumptions built into the framing, the quality of supporting evidence, and the intended audience.\n\nWhen taken together, these elements suggest a conclusion that is reasonable but not definitive. A stronger version of this argument would address counterpoints directly and provide more grounded examples to back its claims.'
};


// --- ELEMENT REFERENCES ---
// Grabbed once at the top. Never query the DOM inside event listeners.
const appName       = document.getElementById('app-name');
const btnNew        = document.getElementById('btn-new');
const toolChips     = document.querySelectorAll('.tool-chip');
const inputLanding  = document.getElementById('input-landing');
const inputDock     = document.getElementById('input-dock');
const btnGoLanding  = document.getElementById('btn-go-landing');
const btnGoDock     = document.getElementById('btn-go-dock');
const outputLabel   = document.getElementById('output-label');
const outputContent = document.getElementById('output-content');


// --- SELECTED TOOL STATE ---
// Tracks the currently active tool. Defaults to the first chip.
let selectedTool = 'Summarize';


// --- TOOL CHIP SELECTION ---
// When a chip is clicked:
// 1. Remove 'active' from all chips
// 2. Add 'active' to the clicked one
// 3. Update selectedTool to match
toolChips.forEach(function(chip) {
  chip.addEventListener('click', function() {
    toolChips.forEach(function(c) {
      c.classList.remove('active');
    });
    chip.classList.add('active');
    selectedTool = chip.textContent.trim();
  });
});


// --- ENTER RESULT MODE ---
// Called when the user clicks Go (from either the landing or the dock).
// Sets the output content, copies text to dock, switches state.
function enterResultMode(text) {
  // Set the output label to the active tool name
  outputLabel.textContent = selectedTool;

  // Fill the output area with the mock response for that tool
  outputContent.textContent = mockResponses[selectedTool];

  // Copy the input text into the dock textarea so it's visible
  inputDock.value = text;

  // Add result-mode to body — CSS handles everything else
  document.body.classList.add('result-mode');

  // Scroll to the top so the user sees the output from the beginning
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// --- RESET TO LANDING ---
// Removes result-mode so CSS returns everything to the landing state.
function resetToLanding() {
  document.body.classList.remove('result-mode');
  // Clear the dock input so old text doesn't linger
  inputDock.value = '';
}


// --- GO BUTTON (landing) ---
// Validates that the textarea is not empty before switching states.
btnGoLanding.addEventListener('click', function() {
  const text = inputLanding.value.trim();
  if (!text) {
    // If empty, just focus the textarea — no state switch
    inputLanding.focus();
    return;
  }
  enterResultMode(text);
});


// --- GO BUTTON (dock) ---
// Same validation, but reads from the dock textarea.
btnGoDock.addEventListener('click', function() {
  const text = inputDock.value.trim();
  if (!text) {
    inputDock.focus();
    return;
  }
  enterResultMode(text);
});


// --- APP NAME CLICK ---
// Only resets if we're already in result mode.
// Clicking the name on the landing state does nothing.
appName.addEventListener('click', function() {
  if (document.body.classList.contains('result-mode')) {
    resetToLanding();
  }
});


// --- NEW BUTTON ---
// Always resets to landing.
btnNew.addEventListener('click', resetToLanding);