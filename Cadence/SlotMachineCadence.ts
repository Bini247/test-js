type AnticipatorConfig = {
  columnSize: number;
  minToAnticipate: number;
  maxToAnticipate: number;
  anticipateCadence: number;
  defaultCadence: number;
};

type SlotCoordinate = {
  column: number;
  row: number;
};

type SpecialSymbol = { specialSymbols: Array<SlotCoordinate> };

type RoundsSymbols = {
  roundOne: SpecialSymbol;
  roundTwo: SpecialSymbol;
  roundThree: SpecialSymbol;
};

type SlotCadence = Array<number>;

type RoundsCadences = {
  roundOne: SlotCadence;
  roundTwo: SlotCadence;
  roundThree: SlotCadence;
};

type CurrentRound = {
  cadence: number;
  anticipation: number;
}

/**
 * Anticipator configuration. Has all information needed to check anticipator.
 * @param columnSize It's the number of columns the slot machine has.
 * @param minToAnticipate It's the minimum number of symbols to start anticipation.
 * @param maxToAnticipate It's the maximum number of symbols to end anticipation.
 * @param anticipateCadence It's the cadence value when has anticipation.
 * @param defaultCadence It's the cadence value when don't has anticipation.
 */
const anticipatorConfig: AnticipatorConfig = {
  columnSize: 5,
  minToAnticipate: 2,
  maxToAnticipate: 3,
  anticipateCadence: 2,
  defaultCadence: 0.25,
};

/**
 * Game rounds with special symbols position that must be used to generate the SlotCadences.
 */
const gameRounds: RoundsSymbols = {
  roundOne: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 1, row: 3 },
      { column: 3, row: 4 },
    ],
  },
  roundTwo: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 0, row: 3 },
    ],
  },
  roundThree: {
    specialSymbols: [
      { column: 4, row: 2 },
      { column: 4, row: 3 },
    ],
  },
};

/**
 * This must be used to get all game rounds cadences.
 */
const slotMachineCadences: RoundsCadences = { roundOne: [], roundTwo: [], roundThree: [] };

/**
 * This function receives an array of coordinates relative to positions in the slot machine's matrix.
 * This array is the positions of the special symbols.
 * And it has to return a slot machine stop cadence.
 * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
 * @returns SlotCadence Array of numbers representing the slot machine stop cadence.
 */
function slotCadence(symbols: Array<SlotCoordinate>): SlotCadence {
  const cadence: SlotCadence = Array(anticipatorConfig.columnSize).fill(0);

  let currentRound:CurrentRound = {
    "cadence": anticipatorConfig.defaultCadence,
    "anticipation": 0
  }

  cadence.map( (value, column) => {
    if(cadence[column - 1] == undefined){
      cadence[column] = 0

      currentRound = calculateRoundCadence(symbols, currentRound, column)
      
    }else if(cadence[column - 1] != undefined) {
      cadence[column] = cadence[column - 1] + currentRound.cadence;
      currentRound.cadence = anticipatorConfig.defaultCadence
      
      currentRound = calculateRoundCadence(symbols, currentRound, column)
    }
  });

  return cadence;
}

/**
 * This function receives an array of coordinates relative to positions in the slot machine's matrix.
 * This array is the positions of the special symbols.
 * And it has to return a slot machine stop cadence.
 * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
 * @param currentRound CurrentRound cadence and anticipation of the current round. Example: { cadence: 1, anticipation: 0 }
 * @param row Number of the column wich the cadence is being calculated
 * @returns CurrentRound cadence and anticipation of the current round. Example: { cadence: 1, anticipation: 0 }
 */
function calculateRoundCadence(symbols:Array<SlotCoordinate>, currentRound:CurrentRound, row:number): CurrentRound {
  if (symbols.length > 0){
    symbols.map( (symbol:any) => {
      if(symbol.column == row){
        currentRound.anticipation++
        if((currentRound.anticipation >= anticipatorConfig.minToAnticipate) && (currentRound.anticipation < anticipatorConfig.maxToAnticipate)){
          currentRound.cadence = anticipatorConfig.anticipateCadence
        }
      }

      if(currentRound.anticipation >= anticipatorConfig.minToAnticipate){
        currentRound.cadence = anticipatorConfig.anticipateCadence
      }

      if(currentRound.anticipation >= anticipatorConfig.maxToAnticipate){
        currentRound.cadence = anticipatorConfig.defaultCadence
      }
    })
  }

  return currentRound
}

/**
 * Get all game rounds and return the final cadences of each.
 * @param rounds RoundsSymbols with contains all rounds special symbols positions.
 * @return RoundsCadences has all cadences for each game round.
 */
function handleCadences(rounds: RoundsSymbols): RoundsCadences {
  
  Object.keys(slotMachineCadences).forEach(function(round) {
    slotMachineCadences[round as keyof RoundsCadences] = slotCadence(rounds[round as keyof RoundsSymbols].specialSymbols);
  })

  return slotMachineCadences;
}

console.log('CADENCES: ', handleCadences(gameRounds));