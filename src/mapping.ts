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
  Task, 
  UserTask,
  Bet,
  UserBet,
  UserFavStat,
  UserDashStat,
  UserAchievement,
  GlobalStat
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

}

function initializeUserDashStat (id: string): void {
  let userDashStat = new UserDashStat(id)
  userDashStat.userName = "Unknown"
  userDashStat.displayAchievement = "None"
  userDashStat.youtube = "None"
  userDashStat.twitter = "None"
  userDashStat.instagram = "None"
  userDashStat.tiktok = "None"
  userDashStat.twitch = "None"
  userDashStat.tribute = BigInt.fromI32(0)
  userDashStat.profit = BigInt.fromI32(0)
  userDashStat.blacklist = []
}

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
  
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStat(globalStatId)
  }
  globalStat.users = globalStat.users.plus(BigInt.fromI32(1))
  globalStat.save()
}

function initializeGlobalStat (id: string): void {
  let globalStat = new GlobalStat(id)
  globalStat.taskProfits = BigInt.fromI32(0)
  globalStat.users = BigInt.fromI32(0)
  globalStat.taskCount = BigInt.fromI32(0)
  globalStat.betProfit = BigInt.fromI32(0)
  globalStat.betCount = BigInt.fromI32(0)
}

  /******************************************/
  /*               BetCreated               */
  /******************************************/

export function handleBetCreated(event: BetCreated): void {

  // Bet Entity
  let bet = new Bet(event.params.betID.toHex())
  log.info('New Bet entity created: {}', [event.params.betID.toHex()])
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
  let userBet = new UserBet(event.params.initiator.toHex() + "-" + event.params.betID.toHex())
  log.info('New UserBet entity created: {} - {}', [event.params.initiator.toHex(), event.params.betID.toHex()])
  userBet.userAddress = event.params.initiator 
  userBet.betData = event.params.betID.toHex()
  userBet.userStake = BigInt.fromI32(0)
  userBet.save()


  // UserAchievement Entity
  let userAchievementid = event.params.initiator.toHex()                                               //hier
  let userAchievement = UserAchievement.load(userAchievementid)
  log.debug('Trying to load userAchievement with ID: {} | {}', [userAchievementid, event.params.initiator.toHex()])
  if(userAchievement == null) {
    userAchievement = initializeUserAchievement(userAchievementid)

  // UserAchievement Entity
  let userAchievementid = event.params.initiator.toHex()                                               //hier
  let userAchievement = UserAchievement.load(userAchievementid)
  log.debug('Trying to load userAchievement with ID: {} | {}', [userAchievementid, event.params.initiator.toHex()])
  if(userAchievement == null) {
    initializeUserAchievement(userAchievementid)

    log.info('New UserAchievement entity created: {}', [event.params.initiator.toHex()])
  }
  userAchievement.betsCreated = userAchievement.betsCreated.plus(BigInt.fromI32(1)) 
  userAchievement.save()
  

  // GlobalStats Entity                                                                   //hier
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    globalStat = initializeGlobalStat(globalStatId)

  // GlobalStat Entity                                                                   //hier
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStat(globalStatId)

  }
  globalStat.betCount = globalStat.betCount.plus(BigInt.fromI32(1)) 
  globalStat.save()
}

  /******************************************/
  /*               BetJoined                */
  /******************************************/

export function handleBetJoined(event: BetJoined): void {

  // Bet Entity
  let bet = Bet.load(event.params.betID.toHex())
  if (event.params.joinA == true) {
    bet.stakeA = bet.stakeA.plus(event.params.amount) 
    bet.participantsA = bet.participantsA.plus(BigInt.fromI32(1)) 
  } else {
    bet.stakeB = bet.stakeB.plus(event.params.amount) 
    bet.participantsB = bet.participantsB.plus(BigInt.fromI32(1))
  }
  bet.save()

  // UserBet Entity
  let userBet = new UserBet(event.params.participant.toHex() + "-" + event.params.betID.toHex())
  log.info('New UserBet entity created: {} - {}', [event.params.participant.toHex(), event.params.betID.toHex()])
  userBet.userAddress = event.params.participant 
  userBet.userStake = event.params.amount
  userBet.joinedA = event.params.joinA
  userBet.betData = event.params.betID.toHex()
  userBet.save()


  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    userFavStat = initializeUserFavStat(userFavStatId)
    log.info('New UserFavStat entity created: {}', [event.params.participant.toHex()])

  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    initializeUserFavStat(userFavStatId)
    log.info('New UserFavStat entity created: {}', [event.params.participant.toHex()])

  }
  userFavStat.betBalance.minus(event.params.amount)
  userFavStat.save()

  // UserAchievement Entity

  let userAchievementId = event.params.participant.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    userAchievement = initializeUserAchievement(userAchievementId)

  let userAchievementId = event.params.participant.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    initializeUserAchievement(userAchievementId)

    log.info('New UserAchievement entity created: {}', [event.params.participant.toHex()])
  }
  userAchievement.betsJoined = userAchievement.betsJoined.plus(BigInt.fromI32(1))
  userAchievement.save()
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

  // Bet Entity
  let bet = Bet.load(event.params.betID.toHex())
  bet.finished = true 
  bet.failed = event.params.failed                       
  bet.winnerPartyA = event.params.winnerPartyA
  bet.draw = event.params.draw 
  bet.save()

  // UserAchievement Entity
  let userAchievement = UserAchievement.load(event.params.initiator.toHex())
  userAchievement.betsFinished = userAchievement.betsFinished.plus(BigInt.fromI32(1)) 
  userAchievement.save()
}

  /******************************************/
  /*               BetRedeemed              */
  /******************************************/

export function handleBetRedeemed(event: BetRedeemed): void {

  // Bet Entity
  let bet = Bet.load(event.params.betID.toHex())
  
  // 1/2 UserBet Entity
  let userBet = UserBet.load(event.params.participant.toHex() + "-" + event.params.betID.toHex())
  userBet.redeemed = true


  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    userFavStat = initializeUserFavStat(userFavStatId)
    log.info('New UserFacStat entity created: {}', [event.params.participant.toHex()])

  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    initializeUserFavStat(userFavStatId)
    log.info('New UserFavStat entity created: {}', [event.params.participant.toHex()])

  }
  userFavStat.betsWon = userFavStat.betsWon.plus(BigInt.fromI32(1)) 
  userFavStat.betBalance = userFavStat.betBalance.plus(event.params.profit)
  userFavStat.betBalance = userFavStat.betBalance.plus(userBet.userStake)
  userFavStat.save()
  
  // 2/2 UserBet Entity
  userBet.userStake = BigInt.fromI32(0)
  userBet.save()


  // GlobalStats Entity
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    globalStat = initializeGlobalStat(globalStatId)

  // GlobalStat Entity
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStats(globalStatsId)

  }
  globalStat.betProfit = globalStat.betProfit.plus(event.params.profit) 
  globalStat.save()
}

  /******************************************/
  /*               BetBailout               */
  /******************************************/

export function handleBetBailout(event: BetBailout): void {

  // UserBet Entity
  let userBet = UserBet.load(event.params.participant.toHex() + "-" + event.params.betID.toHex())
  userBet.userStake = BigInt.fromI32(0)
  userBet.save()


  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    userFavStat = initializeUserFavStat(userFavStatId)
    log.info('New UserFavStats entity created: {}', [event.params.participant.toHex()])

  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    initializeUserFavStat(userFavStatId)
    log.info('New UserFavStat entity created: {}', [event.params.participant.toHex()])

  }
  userFavStat.betBalance = userFavStat.betBalance.plus(event.params.userStake)
  userFavStat.save()
}

  /******************************************/
  /*               BetProved                */
  /******************************************/
  
export function handleBetProved(event: BetProved): void {
  let bet = Bet.load(event.params.betID.toHex())
  bet.proofLink = event.params.proofLink
  bet.save()
}



  //****************************************************************************** */




  /******************************************/
  /*               TaskAdded                */
  /******************************************/

export function handleTaskAdded(event: TaskAdded): void {
  
  // Task Entity
  let task = new Task(event.params.taskID.toHex())
  log.info('New Task entity created: {}', [event.params.taskID.toHex()])
  task.initiatorAddress = event.params.initiator
  task.recipientAddress = event.params.recipient
  task.amount = event.params.amount
  task.entranceAmount = event.params.amount
  task.description = event.params.description
  task.endTask = event.params.endTask
  task.participants = BigInt.fromI32(1)
  task.hashtag1 = event.params.hashtag1
  task.hashtag2 = event.params.hashtag2
  task.hashtag3 = event.params.hashtag3
  task.language = event.params.language
  task.save()

  // UserTask Entity
  let userTask = new UserTask(event.params.initiator.toHex() + "-" + event.params.taskID.toHex())
  log.info('New UserTask entity created: {} - {}', [event.params.initiator.toHex(), event.params.taskID.toHex()])
  userTask.userAddress = event.params.initiator
  userTask.userStake = event.params.amount
  userTask.taskData = event.params.taskID.toHex()
  userTask.save()


  // UserAchievement Entity
  let userAchievementId = event.params.initiator.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    userAchievement = initializeUserAchievement(userAchievementId)
    log.info('New UserAchievements entity created: {}', [event.params.initiator.toHex()])

  // UserAchievement Entity
  let userAchievementId = event.params.initiator.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    initializeUserAchievement(userAchievementId)
    log.info('New UserAchievement entity created: {}', [event.params.initiator.toHex()])

  }
  userAchievement.tasksCreated = userAchievement.tasksCreated.plus(BigInt.fromI32(1))
  userAchievement.save()                                                                   //hier

  // GlobalStats Entity

  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    globalStat = initializeGlobalStat(globalStatId)

  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStats(globalStatsId)

  }
  globalStat.taskCount = globalStat.taskCount.plus(BigInt.fromI32(1)) 
  globalStat.save()
}

  /******************************************/
  /*               TaskJoined               */
  /******************************************/

export function handleTaskJoined(event: TaskJoined): void {
  
  // Task Entity
  let task = Task.load(event.params.taskID.toHex())
  task.participants = task.participants.plus(BigInt.fromI32(1))
  task.amount = task.amount.plus(event.params.amount)
  task.save()

  // UserTask Entity
  let userTask = new UserTask(event.params.participant.toHex() + "-" + event.params.taskID.toHex())
  log.info('New UserTask entity created: {} - {}', [event.params.participant.toHex(), event.params.taskID.toHex()])
  userTask.userAddress = event.params.participant
  userTask.userStake = event.params.amount
  userTask.taskData = event.params.taskID.toHex()
  userTask.save()


  // UserDashStat Entity
  let userDashStatId = event.params.participant.toHex()
  let userDashStat = UserDashStat.load(userDashStatId)
  if(userDashStat == null) {
    userDashStat = initializeUserDashStat(userDashStatId)
    log.info('New UserDashStat entity created: {}', [event.params.participant.toHex()])

  // UserDashStat Entity
  let userDashStatId = event.params.participant.toHex()
  let userDashStat = UserDashStat.load(userDashStatId)
  if(userDashStat == null) {
    initializeUserDashStat(userDashStatId)
    log.info('New UserDashStat entity created: {}', [event.params.participant.toHex()])

  }
  userDashStat.tribute = userDashStat.tribute.plus(event.params.amount)
  userDashStat.save()                                                                    //hier


  // UserAchievements Entity
  let userAchievementId = event.params.participant.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    userAchievement = initializeUserAchievement(userAchievementId)
    log.info('New UserAchievement entity created: {}', [event.params.participant.toHex()])

  // UserAchievement Entity
  let userAchievementId = event.params.participant.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    initializeUserAchievement(userAchievementId)
    log.info('New UserAchievement entity created: {}', [event.params.participant.toHex()])

  }
  userAchievement.tasksJoined = userAchievement.tasksJoined.plus(BigInt.fromI32(1))
  userAchievement.save()                                                                  //hier
}

  /******************************************/
  /*                 Voted                  */
  /******************************************/

export function handleVoted(event: Voted): void {
  
  // Task Entity
  let task = Task.load(event.params.taskID.toHex())
  if (event.params.vote == true) {
    task.positiveVotes = task.positiveVotes.plus(BigInt.fromI32(1))
  } else {
    task.negativeVotes = task.negativeVotes.plus(BigInt.fromI32(1))
  }
  task.finished = event.params.finished
  task.save()

  // UserTask Entity
  let userTask = UserTask.load(event.params.participant.toHex() + "-" + event.params.taskID.toHex())
  userTask.voted = true
  userTask.vote = event.params.vote
  userTask.save()


  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    userFavStat = initializeUserFavStat(userFavStatId)
    log.info('New UserFavStat entity created: {}', [event.params.participant.toHex()])

  // UserFavStat Entity
  let userFavStatId = event.params.participant.toHex()
  let userFavStat = UserFavStat.load(userFavStatId)
  if(userFavStat == null) {
    initializeUserFavStat(userFavStatId)
    log.info('New UserFavStat entity created: {}', [event.params.participant.toHex()])

  }
  if (event.params.vote == true) {
    userFavStat.positiveVotes = userFavStat.positiveVotes.plus(BigInt.fromI32(1))
  } else {
    userFavStat.negativeVotes = userFavStat.negativeVotes.plus(BigInt.fromI32(1))
  }
  userFavStat.save()                                                                             //hier


  // UserAchievements Entity
  let userAchievementId = event.params.participant.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    userAchievement = initializeUserAchievement(userAchievementId)
    log.info('New UserAchievement entity created: {}', [event.params.participant.toHex()])

  // UserAchievement Entity
  let userAchievementId = event.params.participant.toHex()
  let userAchievement = UserAchievement.load(userAchievementId)
  if(userAchievement == null) {
    initializeUserAchievement(userAchievementId)
    log.info('New UserAchievement entity created: {}', [event.params.participant.toHex()])

  }
  userAchievement.tasksVoted = userAchievement.tasksVoted.plus(BigInt.fromI32(1))
  userAchievement.save()                                                                         //hier
}

  /******************************************/
  /*              UserRedeemed              */
  /******************************************/

export function handleUserRedeemed(event: UserRedeemed): void {

  // UserTask Entity
  let userTask = UserTask.load(event.params.participant.toHex() + "-" + event.params.taskID.toHex())
  userTask.userStake = BigInt.fromI32(0)
  userTask.save()

  // UserDashStat Entity
  let id = event.params.participant.toHex()

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    userDashStat = initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.participant.toHex()])

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.participant.toHex()])

  }
  userDashStat.tribute.minus(event.params.amount)
  userDashStat.save()                                                                      //hier
}

  /******************************************/
  /*            RecipientRedeemed           */
  /******************************************/

export function handleRecipientRedeemed(event: RecipientRedeemed): void {

  // Task Entity
  let task = Task.load(event.params.taskID.toHex())
  task.executed = true
  task.save()

  // UserTask Entity
  let userTask = UserTask.load(event.params.recipient.toHex() + "-" + event.params.taskID.toHex())
  userTask.userStake = BigInt.fromI32(0)
  userTask.save()

  // UserDashStat Entity
  let id = event.params.recipient.toHex()

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    userDashStat = initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.recipient.toHex()])

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.recipient.toHex()])

  }
  userDashStat.profit = userDashStat.profit.plus(event.params.amount)
  userDashStat.save()                                                                  //hier


  // GlobalStats Entity
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    globalStat = initializeGlobalStat(globalStatId)

  // GlobalStat Entity
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStat(globalStatId)

  }
  globalStat.taskProfits = globalStat.taskProfits.plus(event.params.amount) 
  globalStat.save()
}

  /******************************************/
  /*              TaskProved                */
  /******************************************/

export function handleTaskProved(event: TaskProved): void {

  // Task Entity
  let task = Task.load(event.params.taskID.toHex())
  task.proofLink = event.params.proofLink
  task.save()
}

  /******************************************/
  /*             NameRegistered             */
  /******************************************/

export function handleNameRegistered(event: NameRegistered): void {

  //  UserDashStat Entity
  let id = event.params.user.toHex()

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    userDashStat = initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  }
  userDashStat.userName = event.params.registeredName.toHex()
  userDashStat.save()                                                              //hier
}

  /******************************************/
  /*            SocialRegistered            */
  /******************************************/

export function handleSocialRegistered(event: SocialRegistered): void {

  // UserDashStat Entity
  let id = event.params.user.toHex()

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    userDashStat = initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  }
  if(event.params.socialID == BigInt.fromI32(1))
    userDashStat.instagram = event.params.registeredLink.toString()
  if(event.params.socialID == BigInt.fromI32(2))
    userDashStat.twitter = event.params.registeredLink.toString()
  if(event.params.socialID == BigInt.fromI32(3))
    userDashStat.tiktok = event.params.registeredLink.toString()
  if(event.params.socialID == BigInt.fromI32(4))
    userDashStat.twitch = event.params.registeredLink.toString()
  if(event.params.socialID == BigInt.fromI32(5))
    userDashStat.youtube = event.params.registeredLink.toString()
  userDashStat.save()                                                          //hier
}

  /******************************************/
  /*            UserBlacklisted             */
  /******************************************/

export function handleUserBlacklisted(event: UserBlacklisted): void {

  // UserDashStat Entity
  let id = event.params.user.toHex()

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    userDashStat = initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  }
  userDashStat.blacklist.push(event.params.userToBlacklist)
  userDashStat.save()                                                          //hier
}

  /******************************************/
  /*       DisplayAchievementChanged        */
  /******************************************/

export function handleDisplayAchievementChanged(event: DisplayAchievementChanged): void {
  
  // UserDashStat Entity
  let id = event.params.user.toHex()

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    userDashStat = initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  let userDashStat = UserDashStat.load(id)
  if(userDashStat == null) {
    initializeUserDashStat(id)
    log.info('New UserDashStat entity created: {}', [event.params.user.toHex()])

  }
  userDashStat.displayAchievement = event.params.achievement
  userDashStat.save()                                                          //hier
}
