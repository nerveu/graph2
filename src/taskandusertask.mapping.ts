import { BigInt } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import {
  RecipientRedeemed,
  TaskAdded,
  TaskJoined,
  TaskProved,
  UserRedeemed,
  Voted
} from "../generated/NerveGlobal/NerveGlobal"
import { 
  Task, 
  UserTask
} from "../generated/schema"


  /******************************************/
  /*               TaskAdded                */
  /******************************************/

export function handleTaskAdded(event: TaskAdded): void {
  
  let taskID = event.params.taskID.toHex()
  let initiator = event.params.initiator.toHex()
  
  
  // Task Entity
  let task = new Task(taskID)
  log.info('New Task entity created: {}', [taskID])
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
  let userTask = new UserTask(initiator + "-" + taskID)
  log.info('New UserTask entity created: {} - {}', [initiator, taskID])
  userTask.userAddress = event.params.initiator
  userTask.userStake = event.params.amount
  userTask.taskData = event.params.taskID.toHex()
  userTask.save()
}

  /******************************************/
  /*               TaskJoined               */
  /******************************************/

export function handleTaskJoined(event: TaskJoined): void {
  
  let taskID = event.params.taskID.toHex()
  let participant = event.params.participant.toHex()
  
  
  // Task Entity
  let task = Task.load(taskID)
  task.participants = task.participants.plus(BigInt.fromI32(1))
  task.amount = task.amount.plus(event.params.amount)
  task.save()

  
  // UserTask Entity
  let userTask = new UserTask(participant + "-" + taskID)
  log.info('New UserTask entity created: {} - {}', [participant, taskID])
  userTask.userAddress = event.params.participant
  userTask.userStake = event.params.amount
  userTask.taskData = event.params.taskID.toHex()
  userTask.save()                                                       
}

  /******************************************/
  /*                 Voted                  */
  /******************************************/

export function handleVoted(event: Voted): void {
  
  let taskID = event.params.taskID.toHex()
  let participant = event.params.participant.toHex()
  
  
  // Task Entity
  let task = Task.load(taskID)
  if (event.params.vote == true) {
    task.positiveVotes = task.positiveVotes.plus(BigInt.fromI32(1))
  } else {
    task.negativeVotes = task.negativeVotes.plus(BigInt.fromI32(1))
  }
  task.finished = event.params.finished
  task.save()

  
  // UserTask Entity
  let userTask = UserTask.load(participant + "-" + taskID)
  userTask.voted = true
  userTask.vote = event.params.vote
  userTask.save()                                                                 
}

  /******************************************/
  /*              UserRedeemed              */
  /******************************************/

export function handleUserRedeemed(event: UserRedeemed): void {

  let taskID = event.params.taskID.toHex()
  let participant = event.params.participant.toHex()
  
  
  // UserTask Entity
  let userTask = UserTask.load(participant + "-" + taskID)
  userTask.userStake = BigInt.fromI32(0)
  userTask.save()                                                               
}

  /******************************************/
  /*            RecipientRedeemed           */
  /******************************************/

export function handleRecipientRedeemed(event: RecipientRedeemed): void {

  let taskID = event.params.taskID.toHex()
  let recipient = event.params.recipient.toHex()

  
  // Task Entity
  let task = Task.load(taskID)
  task.executed = true
  task.save()
}

  /******************************************/
  /*              TaskProved                */
  /******************************************/

export function handleTaskProved(event: TaskProved): void {
   
  let taskId = event.params.taskID.toHex()
  
  
  // Task Entity
  let task = Task.load(taskId)
  task.proofLink = event.params.proofLink
  task.save()
}
