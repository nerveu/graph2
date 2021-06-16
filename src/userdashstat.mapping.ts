import { BigInt } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import {
  DisplayAchievementChanged,
  NameRegistered,
  RecipientRedeemed,
  SocialRegistered,
  TaskJoined,
  UserBlacklisted,
  UserRedeemed
} from "../generated/NerveGlobal/NerveGlobal"
import { 
  UserDashStat
} from "../generated/schema"


  /******************************************/
  /*             Initialization             */
  /******************************************/


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
  userDashStat.save()
}



  //****************************************************************************** */



  /******************************************/
  /*               TaskJoined               */
  /******************************************/

export function handleTaskJoined(event: TaskJoined): void {
  
  let participant = event.params.participant.toHex()

  
  // UserDashStat Entity
  let userDashStat = UserDashStat.load(participant)
  if(userDashStat == null) {
    initializeUserDashStat(participant)
    userDashStat = UserDashStat.load(participant)
    log.info('New UserDashStat entity created: {}', [participant])
  }
  userDashStat.tribute = userDashStat.tribute.plus(event.params.amount)
  userDashStat.save()                                                                                                                                   
}


  /******************************************/
  /*              UserRedeemed              */
  /******************************************/

export function handleUserRedeemed(event: UserRedeemed): void {

  let participant = event.params.participant.toHex()

  
  // UserDashStat Entity
  let userDashStat = UserDashStat.load(participant)
  if(userDashStat == null) {
    initializeUserDashStat(participant)
    userDashStat = UserDashStat.load(participant)
    log.info('New UserDashStat entity created: {}', [participant])
  }
  userDashStat.tribute.minus(event.params.amount)
  userDashStat.save()                                                                    
}

  /******************************************/
  /*            RecipientRedeemed           */
  /******************************************/

export function handleRecipientRedeemed(event: RecipientRedeemed): void {

  let recipient = event.params.recipient.toHex()

  
  // UserDashStat Entity
  let userDashStat = UserDashStat.load(recipient)
  if(userDashStat == null) {
    initializeUserDashStat(recipient)
    userDashStat = UserDashStat.load(recipient)
    log.info('New UserDashStat entity created: {}', [recipient])
  }
  userDashStat.profit = userDashStat.profit.plus(event.params.amount)
  userDashStat.save()                                                                 
}


  /******************************************/
  /*             NameRegistered             */
  /******************************************/

export function handleNameRegistered(event: NameRegistered): void {

  let user = event.params.user.toHex()
    
  
  //  UserDashStat Entity
  let userDashStat = UserDashStat.load(user)
  if(userDashStat == null) {
    initializeUserDashStat(user)
    userDashStat = UserDashStat.load(user)
    log.info('New UserDashStat entity created: {}', [user])
  }
  userDashStat.userName = event.params.registeredName.toHex()
  userDashStat.save()                                                            
}

  /******************************************/
  /*            SocialRegistered            */
  /******************************************/

export function handleSocialRegistered(event: SocialRegistered): void {
  
  let user = event.params.user.toHex()
  
  
  // UserDashStat Entity
  let userDashStat = UserDashStat.load(user)
  if(userDashStat == null) {
    initializeUserDashStat(user)
    userDashStat = UserDashStat.load(user)
    log.info('New UserDashStat entity created: {}', [user])
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
  userDashStat.save()                                                         
}

  /******************************************/
  /*            UserBlacklisted             */
  /******************************************/

export function handleUserBlacklisted(event: UserBlacklisted): void {

  let user = event.params.user.toHex()
    
  
  // UserDashStat Entity
  let userDashStat = UserDashStat.load(user)
  if(userDashStat == null) {
    initializeUserDashStat(user)
    userDashStat = UserDashStat.load(user)
    log.info('New UserDashStat entity created: {}', [user])
  }
  userDashStat.blacklist.push(event.params.userToBlacklist)
  userDashStat.save()                                                         
}

  /******************************************/
  /*       DisplayAchievementChanged        */
  /******************************************/

export function handleDisplayAchievementChanged(event: DisplayAchievementChanged): void {

  let user = event.params.user.toHex()
    
  
  // UserDashStat Entity
  let userDashStat = UserDashStat.load(user)
  if(userDashStat == null) {
    initializeUserDashStat(user)
    userDashStat = UserDashStat.load(user)
    log.info('New UserDashStat entity created: {}', [user])
  }
  userDashStat.displayAchievement = event.params.achievement
  userDashStat.save()                                                         
}
