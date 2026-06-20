const story = {
  START_SCENE: {
    text: "You wake up to a mind-numbingly bright masculine figure; his white glow makes it nearly impossible to discern any features aside from a bit of muscle definition. He speaks before you can get your bearings.\n\t“Welcome, [enteredName]. It seems you have died. Quite unfortunate, really. Worry not, though, I'll be your guide angel.” His voice was desensitized; he sounded like any old worker.\n\tYou place a hand on your head, squinting your eyes, trying to make any sense of what's going on.",
    choices: [
      { id: "ASK_LOCATION_CHOICE", text: '"W-Where am I?"', next: "ANGEL_RESPONSE_ONE_SCENE" },
      { id: "ASK_DEATH_CHOICE", text: '"D-Dead?"', next: "ANGEL_RESPONSE_TWO_SCENE" }
    ]
  },
  ANGEL_RESPONSE_ONE_SCENE: {
    text: "“Why, you're in heaven, my friend. Don't be alarmed. You might have a bit of brain fog; it's just a side effect of your soul ascending. Be proud you made it here and not down below. Now, before we go to the office to decide your fate, do you have any questions?”",
    choices: [
      { id: "ASK_HOW_YOU_DIED_CHOICE", text: '"How did I die?"', next: "ANGEL_RESPONSE_THREE_SCENE" },
      { id: "ASK_WHATS_OFFICE_CHOICE", text: '"What\'s \'the office?\'"', next: "ANGEL_RESPONSE_FOUR_SCENE" }
    ]
  },
  ANGEL_RESPONSE_TWO_SCENE: {
    text: "“Indeed. You died and ascended. You might have a bit of a headache, just a side effect of the ascent; it will clear up in no time at all. Now, before we go to the office to decide your fate, do you have any questions?”",
    choices: [
      { id: "ASK_HOW_YOU_DIED_CHOICE", text: '"How did I die?"', next: "ANGEL_RESPONSE_THREE_SCENE" },
      { id: "ASK_WHATS_OFFICE_CHOICE", text: '"What\'s \'the office?\'"', next: "ANGEL_RESPONSE_FOUR_SCENE" }
    ]
  }
};

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(story));
};
