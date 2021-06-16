import { BigInt } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import {
  BetBailout,
  BetClosed,
  BetCreated,
  BetFinished,
  BetJoined,
  BetProved,
  BetRedeemed,
} from "../generated/NerveGlobal/NerveGlobal"
import { 
  Bet,
  UserBet,
} from "../generated/schema"


  /******************************************/
  /*               BetCreated               */
  /******************************************/

export function handleBetCreated(event: BetCreated): void {

  let betID = event.params.betID.toHex()
  let initiator = event.params.initiator.toHex()
  
  
  // Bet Entity
  let bet = new Bet(betID)
  log.info('New Bet entity created: {}', [betID])
  bet.initiatorAddress = event.params.initiator 
  bet.description = event.params.description 
  bet.textA = event.params.yesText 
  bet.textB = event.params.noText 
  bet.endBet = event.params.endBet 
  bet.hashtag1 = event.params.hashtag1 
  bet.hashtag2 = event.params.hashtag2 
  bet.hashtag3 = event.params.hashtag3 
  bet.language = event.params.language 
  bet.save()

  
  // UserBet Entity
  let userBet = new UserBet(initiator + "-" + betID)
  log.info('New UserBet entity created: {} - {}', [initiator, betID])
  userBet.userAddress = event.params.initiator 
  userBet.betData = event.params.betID.toHex()
  userBet.userStake = BigInt.fromI32(0)
  userBet.save()
}

  /******************************************/
  /*               BetJoined                */
  /******************************************/

export function handleBetJoined(event: BetJoined): void {

  let betID = event.params.betID.toHex()
  let participant = event.params.participant.toHex()
  
  
  // Bet Entity
  let bet = Bet.load(betID)
  if (event.params.joinA == true) {
    bet.stakeA = bet.stakeA.plus(event.params.amount) 
    bet.participantsA = bet.participantsA.plus(BigInt.fromI32(1)) 
  } else {
    bet.stakeB = bet.stakeB.plus(event.params.amount) 
    bet.participantsB = bet.participantsB.plus(BigInt.fromI32(1))
  }
  bet.save()

  
  // UserBet Entity
  let userBet = new UserBet(participant + "-" + betID)
  log.info('New UserBet entity created: {} - {}', [participant, betID])
  userBet.userAddress = event.params.participant 
  userBet.userStake = event.params.amount
  userBet.joinedA = event.params.joinA
  userBet.betData = event.params.betID.toHex()
  userBet.save()
}

  /******************************************/
  /*               BetClosed                */
  /******************************************/

export function handleBetClosed(event: BetClosed): void {

  // Bet Entity
  let bet = Bet.load(event.params.betID.toHex())
  bet.noMoreBets = true
  bet.save()
}

  /******************************************/
  /*               BetFinished              */
  /******************************************/

export function handleBetFinished(event: BetFinished): void {

  let betID = event.params.betID.toHex()
  let initiator = event.params.initiator.toHex()
  
  
  // Bet Entity
  let bet = Bet.load(betID)
  bet.finished = true 
  bet.failed = event.params.failed                       
  bet.winnerPartyA = event.params.winnerPartyA
  bet.draw = event.params.draw 
  bet.save()
}

  /******************************************/
  /*               BetRedeemed              */
  /******************************************/

export function handleBetRedeemed(event: BetRedeemed): void {

  let betID = event.params.betID.toHex()
  let participant = event.params.participant.toHex()
  

  // UserBet Entity 1/2
  let userBet = UserBet.load(participant + "-" + betID)
  userBet.redeemed = true
  userBet.userStake = BigInt.fromI32(0)
  userBet.save()
}

  /******************************************/
  /*               BetBailout               */
  /******************************************/

export function handleBetBailout(event: BetBailout): void {

  let betID = event.params.betID.toHex()
  let participant = event.params.participant.toHex()
  
  
  // UserBet Entity
  let userBet = UserBet.load(participant + "-" + betID)
  userBet.userStake = BigInt.fromI32(0)
  userBet.save()
}

  /******************************************/
  /*               BetProved                */
  /******************************************/
  
export function handleBetProved(event: BetProved): void {

  // Bet Entity
  let bet = Bet.load(event.params.betID.toHex())
  bet.proofLink = event.params.proofLink
  bet.save()
}
