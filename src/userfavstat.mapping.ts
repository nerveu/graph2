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
  DisplayAchievementChanged,
  NameRegistered,
  RecipientRedeemed,
  SocialRegistered,
  TaskAdded,
  TaskJoined,
  TaskProved,
  UserBlacklisted,
  UserRedeemed,
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

  let betID = event.params.betID.toHex()
  let participant = event.params.participant.toHex()
  

  // UserFavStat Entity
  let userFavStat = UserFavStat.load(participant)
  if(userFavStat == null) {
    initializeUserFavStat(participant)
    userFavStat = UserFavStat.load(participant)
    log.info('New UserFavStat entity created: {}', [participant])
  }
  userFavStat.betBalance.minus(event.params.amount)
  userFavStat.save()


  /******************************************/
  /*               BetRedeemed              */
  /******************************************/

export function handleBetRedeemed(event: BetRedeemed): void {

  let betID = event.params.betID.toHex()
  let participant = event.params.participant.toHex()
  

  // UserBet Entity 1/2
  let userBet = UserBet.load(participant + "-" + betID)
  userBet.redeemed = true


  // UserFavStat Entity
  let userFavStat = UserFavStat.load(participant)
  if(userFavStat == null) {
    initializeUserFavStat(participant)
    userFavStat = UserFavStat.load(participant)
    log.info('New UserFacStat entity created: {}', [participant])
  }
  userFavStat.betsWon = userFavStat.betsWon.plus(BigInt.fromI32(1)) 
  userFavStat.betBalance = userFavStat.betBalance.plus(event.params.profit)
  userFavStat.betBalance = userFavStat.betBalance.plus(userBet.userStake)
  userFavStat.save()
  
  
  // 2/2 UserBet Entity 2/2
  userBet.userStake = BigInt.fromI32(0)
  userBet.save()


  /******************************************/
  /*               BetBailout               */
  /******************************************/

export function handleBetBailout(event: BetBailout): void {

  let betID = event.params.betID.toHex()
  let participant = event.params.participant.toHex()

  
  // UserFavStat Entity
  let userFavStat = UserFavStat.load(participant)
  if(userFavStat == null) {
    initializeUserFavStat(participant)
    userFavStat = UserFavStat.load(participant)
    log.info('New UserFavStats entity created: {}', [participant])
  }
  userFavStat.betBalance = userFavStat.betBalance.plus(event.params.userStake)
  userFavStat.save()
}


  /******************************************/
  /*                 Voted                  */
  /******************************************/

export function handleVoted(event: Voted): void {
  
  let taskID = event.params.taskID.toHex()
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
