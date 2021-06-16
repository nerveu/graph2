import { BigInt } from "@graphprotocol/graph-ts"
import {
  BetCreated,
  BetRedeemed,
  RecipientRedeemed,
  TaskAdded,
} from "../generated/NerveGlobal/NerveGlobal"
import { 
  GlobalStat
} from "../generated/schema"


  /******************************************/
  /*             Initialization             */
  /******************************************/

function initializeGlobalStat (id: string): void {
  let globalStat = new GlobalStat(id)
  globalStat.taskProfits = BigInt.fromI32(0)
  globalStat.users = BigInt.fromI32(0)
  globalStat.taskCount = BigInt.fromI32(0)
  globalStat.betProfit = BigInt.fromI32(0)
  globalStat.betCount = BigInt.fromI32(0)
  globalStat.save()
}

  /******************************************/
  /*               BetCreated               */
  /******************************************/

export function handleBetCreated(event: BetCreated): void {

  // GlobalStats Entity                                                                   
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStat(globalStatId)
    globalStat = GlobalStat.load(globalStatId)
  }
  globalStat.betCount = globalStat.betCount.plus(BigInt.fromI32(1)) 
  globalStat.save()
}

  /******************************************/
  /*               BetRedeemed              */
  /******************************************/

export function handleBetRedeemed(event: BetRedeemed): void {

  // GlobalStats Entity
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStat(globalStatId)
    globalStat = GlobalStat.load(globalStatId)
  }
  globalStat.betProfit = globalStat.betProfit.plus(event.params.profit) 
  globalStat.save()
}

  /******************************************/
  /*               TaskAdded                */
  /******************************************/

export function handleTaskAdded(event: TaskAdded): void {
  
  // GlobalStats Entity
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStat(globalStatId)
    globalStat = GlobalStat.load(globalStatId)
  }
  globalStat.taskCount = globalStat.taskCount.plus(BigInt.fromI32(1)) 
  globalStat.save()
}

  /******************************************/
  /*            RecipientRedeemed           */
  /******************************************/

export function handleRecipientRedeemed(event: RecipientRedeemed): void {

  // GlobalStats Entity
  let globalStatId = "1"
  let globalStat = GlobalStat.load(globalStatId)
  if(globalStat == null) {
    initializeGlobalStat(globalStatId)
    globalStat = GlobalStat.load(globalStatId)
  }
  globalStat.taskProfits = globalStat.taskProfits.plus(event.params.amount) 
  globalStat.save()
}

