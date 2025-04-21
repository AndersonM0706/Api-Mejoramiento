export const determineWinner = (player1, player2) => {
  let winner = null;
  let reason = '';

  if (player1.guerrero.power === player2.guerrero.power) {
    reason = 'Ambos guerreros tienen el mismo poder.';
  } else if (player1.guerrero.power > player2.guerrero.power) {
    winner = player1.name;
    reason = `${player1.guerrero.name} supera a ${player2.guerrero.name}.`;
  } else {
    winner = player2.name;
    reason = `${player2.guerrero.name} supera a ${player1.guerrero.name}.`;
  }

  return { winner, reason };
};