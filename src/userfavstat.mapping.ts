import { BigInt } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import {
  BetBailout,
  BetJoined,
  BetRedeemed,
  Voted
} from "../generated/NerveGlobal/NerveGlobal"
import { 
  UserFavStat
} from "../generated/schema"


  /******************************************/
  /*             Initialization             */
  /******************************************/

function initializeUserFavStat (id: string): void {
  let userFavStat = new UserFavStat(id)
  userFavStat.negativeVotes = BigInt.fromI32(0)
  userFavStat.positiveVotes = BigInt.fromI32(0)
  userFavStat.betBalance = BigInt.fromI32(0)
  userFavStat.betsWon = BigInt.fromI32(0)
  userFavStat.betsLost = BigInt.fromI32(0)
  userFavStat.save()
}

  /******************************************/
  /*               BetJoined                */
  /******************************************/

export function handleBetJoined(event: BetJoined): void {
  
  let participant = event.params.participant.toHex()

  // UserFavStat Entity
  let userFavStat = UserFavStat.load(participant)
  if(userFavStat == null) {
    initializeUserFavStat(participant)
    userFavStat = UserFavStat.load(participant)
    log.info('New UserFavStat entity created: {}', [participant])
  }
  userFavStat.betBalance = userFavStat.betBalance.minus(event.params.amount)
  userFavStat.save()
}

  /******************************************/
  /*               BetRedeemed              */
  /******************************************/

export function handleBetRedeemed(event: BetRedeemed): void {

  let participant = event.params.participant.toHex()

  // UserFavStat Entity
  let userFavStat = UserFavStat.load(participant)
  if(userFavStat == null) {
    initializeUserFavStat(participant)
    userFavStat = UserFavStat.load(participant)
    log.info('New UserFacStat entity created: {}', [participant])
  }
  userFavStat.betsWon = userFavStat.betsWon.plus(BigInt.fromI32(1)) 
  userFavStat.betBalance = userFavStat.betBalance.plus(event.params.profit)
  //userFavStat.betBalance = userFavStat.betBalance.plus(userBet.userStake)
  userFavStat.save()
}

  /******************************************/
  /*               BetBailout               */
  /******************************************/

export function handleBetBailout(event: BetBailout): void {

  let participant = event.params.participant.toHex()
  
  // UserFavStat Entity
  let userFavStat = UserFavStat.load(participant)
  if(userFavStat == null) {
    initializeUserFavStat(participant)
    userFavStat = UserFavStat.load(participant)
    log.info('New UserFavStat entity created: {}', [participant])
  }
  userFavStat.betBalance = userFavStat.betBalance.plus(event.params.userStake)
  userFavStat.save()
}

  /******************************************/
  /*                 Voted                  */
  /******************************************/

export function handleVoted(event: Voted): void {

  let participant = event.params.participant.toHex()
  
  // UserFavStat Entity
  let userFavStat = UserFavStat.load(participant)
  if(userFavStat == null) {
    initializeUserFavStat(participant)
    userFavStat = UserFavStat.load(participant)
    log.info('New UserFavStat entity created: {}', [participant])
  }
  if (event.params.vote == true) {
    userFavStat.positiveVotes = userFavStat.positiveVotes.plus(BigInt.fromI32(1))
  } else {
    userFavStat.negativeVotes = userFavStat.negativeVotes.plus(BigInt.fromI32(1))
  }
  userFavStat.save()                                                                                                                                                 
}
