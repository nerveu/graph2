import { BigInt } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import {
  BetCreated,
  BetFinished,
  BetJoined,
  TaskAdded,
  TaskJoined,
  Voted
} from "../generated/NerveGlobal/NerveGlobal"
import { 
  UserAchievement
} from "../generated/schema"


  /******************************************/
  /*             Initialization             */
  /******************************************/

function initializeUserAchievement (id: string): void {
  let userAchievement = new UserAchievement(id)
  userAchievement.tasksCreated = BigInt.fromI32(0)
  userAchievement.tasksJoined = BigInt.fromI32(0)
  userAchievement.tasksVoted = BigInt.fromI32(0)
  userAchievement.betsCreated = BigInt.fromI32(0)
  userAchievement.betsJoined = BigInt.fromI32(0)
  userAchievement.betsFinished = BigInt.fromI32(0)
  userAchievement.accountCreation = BigInt.fromI32(0)
  userAchievement.seasonOneRank = BigInt.fromI32(0)
  userAchievement.seasonTwoRank = BigInt.fromI32(0)
  userAchievement.seasonThreeRank = BigInt.fromI32(0)
  userAchievement.save()
}

  /******************************************/
  /*               BetCreated               */
  /******************************************/

export function handleBetCreated(event: BetCreated): void {

  let initiator = event.params.initiator.toHex()

  // UserAchievement Entity                                       
  let userAchievement = UserAchievement.load(initiator)
  if(userAchievement == null) {
    initializeUserAchievement(initiator)
    userAchievement = UserAchievement.load(initiator)
    log.info('New UserAchievement entity created: {}', [initiator])
  }
  userAchievement.betsCreated = userAchievement.betsCreated.plus(BigInt.fromI32(1)) 
  userAchievement.save()
}

  /******************************************/
  /*               BetJoined                */
  /******************************************/

export function handleBetJoined(event: BetJoined): void {

  let participant = event.params.participant.toHex()
  
  // UserAchievement Entity
  let userAchievement = UserAchievement.load(participant)
  if(userAchievement == null) {
    initializeUserAchievement(participant)
    userAchievement = UserAchievement.load(participant)
    log.info('New UserAchievement entity created: {}', [participant])
  }
  userAchievement.betsJoined = userAchievement.betsJoined.plus(BigInt.fromI32(1))
  userAchievement.save()
}

  /******************************************/
  /*               BetFinished              */
  /******************************************/

export function handleBetFinished(event: BetFinished): void {

  let initiator = event.params.initiator.toHex()
  
  // UserAchievement Entity
  let userAchievement = UserAchievement.load(initiator)
  userAchievement.betsFinished = userAchievement.betsFinished.plus(BigInt.fromI32(1)) 
  userAchievement.save()
}

  /******************************************/
  /*               TaskAdded                */
  /******************************************/

export function handleTaskAdded(event: TaskAdded): void {
  
  let initiator = event.params.initiator.toHex()

  // UserAchievement Entity
  let userAchievement = UserAchievement.load(initiator)
  if(userAchievement == null) {
    initializeUserAchievement(initiator)
    userAchievement = UserAchievement.load(initiator)
    log.info('New UserAchievements entity created: {}', [initiator])
  }
  userAchievement.tasksCreated = userAchievement.tasksCreated.plus(BigInt.fromI32(1))
  userAchievement.save()                                                                   
}

  /******************************************/
  /*               TaskJoined               */
  /******************************************/

export function handleTaskJoined(event: TaskJoined): void {
  
  let participant = event.params.participant.toHex()
  
  // UserAchievements Entity
  let userAchievement = UserAchievement.load(participant)
  if(userAchievement == null) {
    initializeUserAchievement(participant)
    userAchievement = UserAchievement.load(participant)
    log.info('New UserAchievement entity created: {}', [participant])
  }
  userAchievement.tasksJoined = userAchievement.tasksJoined.plus(BigInt.fromI32(1))
  userAchievement.save()                                                                 
}

  /******************************************/
  /*                 Voted                  */
  /******************************************/

export function handleVoted(event: Voted): void {
  
  let participant = event.params.participant.toHex()
  
  // UserAchievements Entity
  let userAchievement = UserAchievement.load(participant)
  if(userAchievement == null) {
    initializeUserAchievement(participant)
    userAchievement = UserAchievement.load(participant)
    log.info('New UserAchievement entity created: {}', [participant])
  }
  userAchievement.tasksVoted = userAchievement.tasksVoted.plus(BigInt.fromI32(1))
  userAchievement.save()                                                                        
}

