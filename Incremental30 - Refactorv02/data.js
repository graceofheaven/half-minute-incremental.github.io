
gold = new Decimal(15);
total_gold = new Decimal(15);
global_mul = new Decimal(1);
global_exp = new Decimal(1);
game_prestige_time = new Decimal(0);
//modifier
/*
-base GPS
-wife determination
-upgrade modifier
-platinum modifier
-bloodline
-diplomacy
 */
function getGPS () {
    TGP = new Decimal(0);
    if (wife.level<3) {
        for (i=0;i<building.name.length;i++) {
            TGP = TGP.add(getIndexGPS(i))
        }
        return TGP.mul(achievement.all_achievement_mul()).mul(prestigeT1_MS.PrT1_MS3()).pow(bloodline.all_bond_exp()).pow(achievement.achievement_bonus17()).pow(wife.wiferankIV()).round();

    
    }
    if (wife.level>=3) {
        TGP = kingdom.total_buildings().mul(upgrade.multi[7]).mul(building.income[7]).mul(wife_determination_multi).mul(wiferankIII()).mul(platinum_multi).mul(prestigeT1_MS.PrT1_MS3()).mul(diplomacy.passive_diplo_bonus(0)).pow(bloodline.all_bond_exp()).mul(achievement.all_achievement_mul()).pow(achievement.all_achievement_exp()).pow(wife.wiferankIV()).round();
        return TGP;
    }

}
function getIndexGPS(index) {
    GP = new Decimal(0);
    GP = GP.add(building.income[index]).mul(building.count[index]).mul(upgrade.building_multi(index)).mul(wife_determination_multi).mul(wiferankIII()).mul(platinum_multi).mul(achievement.achievement_bonus06()).mul(achievement.achievement_bonus15()).round();
    return GP;

}
function wiferankIII() {
    if (30-game.timer < 1 && wife.level >=2) {
        if (achievement.obtained[1][4]==true && game.timer >15) {
            return 15**Math.log10(15);

        }
        return 1;
    }
    else if(wife.level>=2 && achievement.obtained[1][1]==true){
        if (achievement.obtained[1][4]==true && game.timer >15) {
            return 15**Math.log10(15);

        }
        return (30-game.timer)**Math.log10(30-game.timer);
    } 
    else if (wife.level>=2) {return 30-game.timer}
    else return 1;
}

function k_seps(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
function format(number) {
    if (number.toString() == "Infinity") {return Infinity}
    num = new Decimal(number);
    bottom = 10**(num.mag - Math.floor(num.mag));
    rep = num.layer;
    if (rep>1) {
        return "10<sup>".repeat(rep-1)+k_seps(Math.floor(num.mag))+"</sup>".repeat(rep-1);

    }
    if (rep==1) {
        return bottom.toFixed(2)+"*10<sup>".repeat(rep)+k_seps(Math.floor(num.mag))+"</sup>".repeat(rep);

    }
    else return k_seps(num);

}
function prestigeT1_MS3() {
    temp = prestigeT1_MS.PrT1_MS3();
    return temp;
}

var building = {
    name:[
        "Herb Scrounging",
        "Food Stall",
        "Oracle Tent",
        "Stable",
        "Quarry",
        "Bank",
        "Castle",
        "Temple of Time",

    ],
    base_cost:[new Decimal(15),
        new Decimal(100),
        new Decimal(5000),
        new Decimal(100000),
        new Decimal(250000000),
        new Decimal(500000000000),
        new Decimal("10000000000000"),
        new Decimal("77777777777777777"),
    ],
    cost:[new Decimal(15),
        new Decimal(100),
        new Decimal(5000),
        new Decimal(100000),
        new Decimal(250000000),
        new Decimal(500000000000),
        new Decimal("10000000000000"),
        new Decimal("77777777777777777"),
    ],
    income:[new Decimal(5),
        new Decimal(25),
        new Decimal(500),
        new Decimal(10000),
        new Decimal(5000000),
        new Decimal(5000000000),
        new Decimal(100000000000),
        new Decimal(777777777777777),
    ],
    
    count:[
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
    ],
    multi:[
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
    ],
    image:[
        "HMH2Herb.png",
        "HMH2FoodStall.png",
        "HMH2OracleTent.png",
        "HMH2Stable.png",
        "HMH2Quarry.png",
        "HMH2Bank.png",
        "HMH2Castle.png",
        "HMH2TempleofTime.png",

    ],
    desc:["We all start somewhere"],
    cur_tier:0,
    purchase: function(index) {
        if (gold.gte(new Decimal(building.cost[index]))) {
            if (new Decimal(building.count[index]).eq(0)) {
                building.cur_tier++;
            }
            if (wife.level < 3) {
                gold = gold.sub(new Decimal(this.cost[index]));
            }
            building.count[index] = building.count[index].add(1);
            building.cost[index] = building.cost[index].mul(1.1).round();
            
            display.updateShop();
            display.updateGold();
            
        }
    },
    max_purchase:function(index) {
        if (gold.gte(new Decimal(building.cost[index]))) {
            if (new Decimal(building.count[index]).eq(0)) {
                building.cur_tier++;
            }
            purchasable_count = Decimal.affordGeometricSeries(gold,this.base_cost[index],1.1,building.count[index]).round();
            cost_increase = Decimal.sumGeometricSeries(purchasable_count,this.base_cost[index],1.1,building.count[index]).round();
            building.cost[index] = building.cost[index].add(cost_increase);
            building.count[index] = building.count[index].add(purchasable_count);
            
            if (wife.level < 3) {
                gold = gold.sub(new Decimal(cost_increase));
            }

        }

    },
    autopurchase:function() {
        if (prestigeT1_MS.platinum_obtained[2] == true && this.auto_building == true && wife.level <3) {
                index = 0;
                temp_cost = new Decimal(building.cost[0]);
            for (i=0;i<building.cost.length;i++) {
                temp_index= new Decimal(building.cost[i]);
            if (building.cost[i].lte(temp_cost) && i>0 && temp_index.lte(gold.div(10))) {
                temp_cost = temp_index;
                index = i;
            }
            }
            building.max_purchase(index);
            

            
        
        }
    },
    autopurchasemk2:function(){
        if (prestigeT1_MS.platinum_obtained[2] == true && this.auto_building == true && wife.level >=3) {
            while(gold.gte(kingdom.current_cost)) {
                kingdom.purchase_buildings();
            }
        }
    },
    
    auto_building: false,
    toggle_autopurchase:function() {
        if (this.auto_building == true) {
            this.auto_building = false
            display.updateAutoBuilding();
        } else {this.auto_building = true; display.updateAutoBuilding();}
    },
    check_autobuilding:function() {
        if (this.auto_building == true) {
            return "On";
        } else return "Off";

    },
    total_building: function() {
        TB = new Decimal(0);
        for (i=0;i<building.count.length;i++) {
            temp = new Decimal(building.count[i]);
            TB = TB.add(temp.round());


        }
        return TB;
    }

}
var game = {
    reverse:false,
    timer:30,
    countdown:function () {
        if (game.timer >=0.01 && prayer.reverse == false) {
            game.timer = (Math.round(game.timer * 100) - 1) / 100;
            
        }
        if (prestigeT1_MS.platinum_obtained[0] == true && gold.gte(prayer_cost) && game.timer == 0) {
            prayer.pray();
        }
        if (prayer.reverse == true) {
            game.timer = (Math.round(game.timer * 100) + 11) / 100;
            if (game.timer >= 30) {
                prayer.reverse =false;
                game.timer = 30;
            }
        }
    },
}
prayer_cost = new Decimal(100);
var prayer = {
    reverse :false,
    count:[0,0,0,0,0,0],
    danger:0,
    
    name:"Pray",
    img:"HMH2GoddessStatue.png",
    threat:[
        "",
        "They know",
        "They see you",
    ],

    pray:function() {
        
         if (gold.gte(prayer_cost)) {
                gold= gold.sub(prayer_cost)
                prayer_cost= this.escalation(prayer_cost);
                if (achievement.obtained[0][2] == false) {
                    achievement.obtained[0][2] = true;
                    display.updateAchievementNotification(0,2);
                    display.updateAchievement();
                }
                this.reverseTime()
                display.updateGold();
                display.updatePrayer()
                this.count[this.danger]++;  
         }
         else if(prayer_cost!=Infinity) {
         if(confirm("Are you sure? This will be your last prayer!") && prayer_cost != Infinity) {
            this.reverseTime();
            prayer_cost = Infinity;
            display.updatePrayer();
            display.updateGold();
            
         }
        }
        

    },
    reverseTime: function() {
        this.reverse = true;
        if (game.timer >=30) {
            this.reverse = false;
        }
    },
    check_danger:function() {
        if (((getGPS().lte(1e32) && game_prestige_time.lte(960)) || game_prestige_time.gte(960)) && prayer.danger < 1) {
            this.danger = 0;
        }
        else if(getGPS().gte(1e32)&& getGPS().lte("1e1200")){
            this.danger = 1;

        }else if(getGPS().gte("1e1200")){
            this.danger = gold.add(1).log(10).add(1).log(2).div(10).floor().add(1).toFixed(0);

        }
        
    },
    escalation:function(num) {
        cur_cost = new Decimal(num);
        base = new Decimal(1);
        if (this.danger>0) {
            return cur_cost.mul(10).pow(base.add(gold.add(1).log(10).add(1).log(2).div(10))).round();
        }
        return cur_cost.mul(10);
    },
    warning:function() {
        if(gold.lte(prayer_cost)) {
            return "glow";
        }
        else return "";
    },
    last_prayer_trigger:function() {
        if(gold.lte(prayer_cost)) {
            return "Last Prayer";
        }
        else return prayer.name;
        
    },
    total_prayer_count:function(index) {
        TPC = new Decimal(0);
        for (tpci = index;tpci<prayer.count.length;tpci++) {
            TPC = TPC.add(prayer.count[tpci]);
        }
        return TPC;
    }
}   
    
wife_willpower=new Decimal(0);
wife_determination=new Decimal(0);
wife_determination_cost= new Decimal(32);
wife_determination_multi= new Decimal(1);
var wife = {
    level:0,
    breed_lvl:0,
    
    img:["ChildhoodFriend.png",
        "Girlfriend.png",
        "Wife.png",
        "Queen.png"
    ],
    rank:[
        "I",
        "II",
        "III",
        "IV",

    ],
    income:[
        new Decimal(3),
        new Decimal(25),
        new Decimal(150),
        new Decimal(1e15),

    ],
    name:[
        "Childhood Friend",
        "Girlfriend",
        "Wife",
        "Queen",

    ],
    cost:[
        new Decimal(1e6),
        new Decimal(1e15),
        new Decimal(1e100),
        Infinity

    ],
    desc:[
        "Your childhood friend, her presence alone give you the will to push forward despite the world is coming to its end.",
        "Your girlfriend, the bond between you two can only deepen further as you two progress",
        "Your wife, you two remember the vow between each other as you two held each other dearly.",
        "Your betrothed queen, her regalness and majestic appearance she has is nothing in comparison to her will and determination."

    ],
    effect:[
        "-Passively grant you willpower which will grant Determination by its amounts (multiply your GPS)",
        "-Willpower gain is increased the longer this prestige",
        "-GPS gain an increasingly powerful multiplier the closer timer is to 0",
        "-Reorganize all buildings into your own kingdom which grants power to GPS by their total amount. Buildings don't cost gold to purchase anymore. Unlock Diplomacy",

    ],
    upgrade:[
        "Spend some time with her even if you have 30 second at most",
        "Propose to her even if the time you have together is short",
        "Decree your own constitutional monarchy with your wife as the queen",
        "There's nowhere forward for now"
    ],
    getWPS: function() {
        wp = new Decimal(0);
        wp = this.income[wife.level].mul(this.wiferankII()).mul(prestigeT1_MS.PrT1_MS1()).round();
        return wp;

    },
    wiferankII:function(){
        if (wife.level <1) {
            return 1;
        }
        if (prestigeT1_MS.platinum_obtained[4]==true) {
            return game_prestige_time.add(1).pow(game_prestige_time.add(1).log10());
        }
        else return game_prestige_time.add(1).log10();
    },
    wiferankIV:function(){
        if(wife.level<3) {
            return 1
        }
        if (kingdom.total_buildings().add(1).log(10).add(1).log(10).div(4).mul(kingdom.restructure_bonus()).add(1).lte(1)) {
            return 1;
        }
        return kingdom.total_buildings().log(10).add(1).log(10).div(4).mul(kingdom.restructure_bonus()).add(1);
    },
    

    stronger_than_you: function() {
        wife_willpower = wife_willpower.add(this.getWPS());
        if(wife_willpower.gte(wife_determination_cost)) {
            while (wife_willpower.gte(wife_determination_cost)) {
                wife_determination=wife_determination.add(1);
                wife_determination_cost = wife_determination_cost.mul(2);
            }
            
        }
            
        if(wife_determination.lt(2)) {
        wife_determination_multi = new Decimal(1);
        }
        else {
            if (prestigeT1_MS.platinum_obtained[1] == true) {
                if (prestigeT1_MS.platinum_obtained[9]==true) {
                    wife_determination_multi = wife_determination.add(1).pow(reboot_decimal(2).add(wife_determination.add(1).log(2)))

                }
                else wife_determination_multi = wife_determination.add(1).pow(2);
            }
            else wife_determination_multi = wife_determination;
        }
        

    },
    determulti: function() {
        if (prestigeT1_MS.platinum_obtained[1]== true) {
            return "(*"+format(wife_determination_multi.round())+")";
        }
        else return "";
    },
    purchase : function() {
        if(gold.gte(wife.cost[wife.level])) {
            wife.level++;
        }
        display.updateWife();
        display.updateGold();
        
    },
    // bloodline
    breed: function() {
        if (gold.gte(wife.breed_cost[wife.breed_lvl]) && bloodline.kinCount()<=wife.breed_limit[wife.level]) {
            bloodline.check[this.breed_lvl] = true;
            this.breed_lvl++;
        }
        display.updateGold();
        display.updateBloodline();
        display.updateWife();

    },// bloodline
    breed_cost:[
        1e40,
        1e308,
        Infinity,

    ],
    breed_limit:[
        0,
        0,
        1, //firstborn (III)
        2, //royalty (IV)
        4, //infernal (V)
        6, //divine (VI)
        7, //eldritch (VII)
        8, //eternity (VIII)
    ],
    effectList: function() {
        list = "";
        for (i=0;i<=wife.level;i++) {
            list += wife.effect[i];
            list +="<br>";
        }
        return list;

    }
}
// Your kins, take good care of them please.
var bloodline = {
    name:[
        "Lucky",
        "Lucia"
    ],
    title:[
        "the Firstborn",
        "the Prodigal Princess",

    ],
    img:[
        "Lucky",
        "Lucia"
    ],
    gender:[
        "son",
        "daughter"
    ],
    background_color:[
        "azure",
        "aquamarine",
    ],
    //bloodline - wife
    check:[
        false,
        false,
        false,
    ],
    bond:[
        new Decimal(0),
        new Decimal(0),

    ],
    bond_gain:[
        new Decimal(5),
        new Decimal(5),
    ],
    bond_time:[
        0,
        0,
    ],
    interact_time:[//save
        new Decimal(0),
        new Decimal(0),

    ],
    wait_timer:[//save
        30,
        30,

    ],
    time_penalty:function(index) {
        if (bloodline.bond_time[index]>600) {
            return 1;
        }
        else return bloodline.bond_time[index]/600;

    },
    sibling_bond: function() {
        if (bloodline.kinCount()==1) {
            return 1;
        }else {
        sb = new Decimal(0);
        for (i=0;i<this.name.length;i++) {

            sb = sb.add(reboot_decimal(bloodline.bond[i]).add(1).log2()); 
        }
        return sb.log10().div(10).add(1);
        }
    },
    bond_passing_time() {
        for (i=0;i<bloodline.check.length;i++) {
            if (bloodline.check[i]==true) {
                bloodline.bond_time[i]++;
            }
        }
    },
    bond_exp: function(index) {
        if (this.kinCount() == 0) {
            return 1
        }
        
        bond_e = new Decimal(0);
        temp = new Decimal(this.bond[index]);
        bond_e = temp.add(1).log10().add(1).log10().mul(bloodline.time_penalty(index)).add(1).pow(this.interact_bonus(index));
        return bond_e.mul(this.sibling_bond()).toFixed(2); //sibling bond meant to be here but it was too powerful
    },
    getBPS: function(index) {
        bps = new Decimal(0);
        bps = bloodline.bond_gain[index].mul(wife.wiferankII().log2()).mul(achievement.achievement_bonus16()).pow(bloodline.interact_bonus(index)).mul(prestigeT1_MS.PrT1_MS9());
        return bps.round();
    },
    all_bond_exp:function() {
        TBE = new Decimal(1);
        for (i=0;i<this.bond.length;i++) {
            TBE = TBE.mul(this.bond_exp(i));
        }
        return TBE;

    },
    bondStrengthen:function() {
        for (i=0;i<this.bond.length;i++) {
            if (this.check[i] == true) {
                temp = new Decimal(this.bond[i]);
                temp = temp.add(this.getBPS(i)).round();
                this.bond[i] = temp;
            }
            
        }
    },
    kinCount:function() {
        tempcount = 0;
        for (i=0;i<bloodline.name.length;i++) {
            if(bloodline.check[i]== true) {
                tempcount++;
            }    
        }
        return tempcount;
    },
    checkBloodline:function() {
        for (i=0;i<bloodline.name.length;i++) {
            if(bloodline.check[i]== true) {
                return true;
            }    
        }
        return false;

    },
    interact_bonus:function(index) {
        count = new Decimal(this.interact_time[index]);
        return count.div(100).add(1);
    },
    interact:function(index) {
        if (this.wait_timer[index]<=0) {
        temp = new Decimal(this.interact_time[index]).add(1);
        this.interact_time[index] = temp;
        this.wait_timer[index] = 30;
        display.updateBloodline();

        }
        
    },
    waiting:function() {
        for (i=0;i<this.wait_timer.length;i++) {
            if (this.wait_timer[i]>0) {
                this.wait_timer[i]--;
            }
        }
    },
    heir_bonus:function(index) {
        if (index == 1) {
            return ", opportunity gain.";
        }
        return "";
    },
    total_interact_time:function() {
        TTI = new Decimal(0);
        for (bi =0;bi<bloodline.name.length;bi++) {
            TTI = TTI.add(bloodline.interact_time[bi]);
        }
        return TTI;
    },
    //bloodline heir bonus
    Lucia_bonus:function() {
        if (bloodline.check[1]==false) {
            return 1;
        }
        return bloodline.bond_exp(1);
    }
}
//upgrade
var upgrade = {
    name:[
        "Pricey Herb",
        "Herbal Pastry",
        "Herbal Incense",
        "Herb-fed Stallion",
        "Herbal Stimulant",
        "Herb Stimulus",
        "Herbal Convention",
        "Divine Herb",
    ],
    cost:[
        new Decimal(15000),
        new Decimal(100000),
        new Decimal(5000000),
        new Decimal(100000000),
        new Decimal(25000000000),
        new Decimal(50000000000000),
        new Decimal("500000000000000"),
        new Decimal("77777777777777777777"),
    ],
    multi:[
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),

    ],
    building_index:[
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
    ],
    image:[
        "HMH2PriceyHerbPouch.png",
        "HMH2Pastry.png",
        "HerbalIncenseBurner.png",
        "HerbfedStallion.png",
        "HerbStimulant.png",
        "HerbStimulus.png",
        "HerbConvention.png",
        "GoldenHerb.png",
    ],
    purchased:[
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ],
    desc:[
        "Put some more herbs in a pouch and markup their prices. The perceived quality really make it work even if nothing about it changed.",
        "Use herbs to make pastry thus creating your own signature dish. It's more healthy, right?",
        "Herbal incense to make people lessen their guard and become more convinced by your fortune telling.",
        "Healthy food scource for better stallion. Totally making up for otherwise lack of general nutrients.",
        "Herb-based performance enhancement concoctions on miners so that they can work for much longer and better.",
        "Use herbs to 'mint' more gold. How? Don't question it too much. It's for your own good.",
        "Build an entire economy using herbs as major accomodity. Remember how you control the banks? Yeah...",
        "Have literal emissaries from heaven bring down the most powerful and divine herbs that could ever exist."
    ],
    purchase:function(index) {
        if (!this.purchased[index] && gold.gte(this.cost[index])) {
            this.purchased[index] = true;
            gold = gold.sub(this.cost[index]);
            display.updateGold();
            display.updateUpgrade();

        }

    },
    updateUpgradeMulti:function() {
        for (i=0;i<building.name.length;i++) {  
            if (upgrade.purchased[i] == true) {
                if (this.upgradeMulti(i)>1) {
                    upgrade.multi[i] = this.upgradeMulti(i);
                    building.multi[i] = upgrade.multi[i];
                } else
                { upgrade.multi[i] = new Decimal(1);
                building.multi[i] = upgrade.multi[i];}; 
            }
        }
    },
    building_multi:function(index) {
        if (upgrade.purchased[index] == false){return 1}
        else return this.upgradeMulti(index);
    },
    upgradeMulti:function(index) {
        
        modifier = new Decimal(10)
        if (prestigeT1_MS.platinum_obtained[6]==true) {
            if (wife.level >= 3){
                if (prestigeT1_MS.PrT1_MS5(kingdom.total_buildings().pow(modifier.sub(index)).add(1).log10()).lte(1)) {
                    return 1;
                }
                return prestigeT1_MS.PrT1_MS5(kingdom.total_buildings().pow(modifier.sub(index)).add(1).log10());
            }
            if (prestigeT1_MS.PrT1_MS5(building.total_building().pow(modifier.sub(index)).add(1).log10()).lte(1)) {
                return 1;
            }
            return prestigeT1_MS.PrT1_MS5(building.total_building().pow(modifier.sub(index)).add(1).log10());
        }
        if (prestigeT1_MS.PrT1_MS5(building.count[index].pow(modifier.sub(index)).add(1).log10()).lte(1)) {
                return 1;
        }
        return prestigeT1_MS.PrT1_MS5(building.count[index].pow(modifier.sub(index)).add(1).log10());
        

    },
    checkall:function() {
        for (i=0;i<8;i++) {
            if (upgrade.purchased[i] == false) {
                return false;
            }
        }
        return true;
    }

}
//music player
var musicplayer= {
    name:["Half-Minute Hero - Desperate Strike (Extended).mp3",
    "Kuro no Kiseki II CRIMSON SiN - Boss Theme 1.mp3",
    "Rigel Theatre - Khaos.mp3",
    "Ys I Eternal - Final Battle but beat 2 and 4 are swapped.mp3"



    ],
    
}
//T1 prestige 
platinum = new Decimal(0);
platinum_multi = new Decimal(1);

var prestigeT1 = {
    image:[
        "Platinum",
        "Titanium",
        "Uranium",
    ],
    name:[
        "platinum",
        "titanium",
        "uranium",
    ],
    color:[
        "gray",
        "azure",
        "gold",

    ],
    unlock:[
        true,
        false,
        false,
    ],
    formulaLvl:0,
    formula:[
        "(x+1)<sup>2</sup>"

    ],
    unlock_ach_milestone:false,
    prestige_time:0,
    confirm:true,
    confirmcheck:function() {
        if (this.confirm == true) {
            return "On";
        }else return "Off";
    },
    toggleConfirmation:function() {
        if (prestigeT1.confirm == true) {
            prestigeT1.confirm = false;
        } else prestigeT1.confirm = true;
        display.updatePrestigeT1Confirmation();
    },
    plat_gain: function(){
        base_pow = reboot_decimal(10);
        if (prestigeT1_MS.platinum_obtained[7]==true) {
            base_pow = reboot_decimal(2);
        }
        if (gold.gte(1e19)) {
            plat_g = new Decimal(0);
            plat_g = gold.add(1).div(1e19).log(base_pow).floor();
            return plat_g;
        }
        return new Decimal(0);
        
    },
    gain_plat:function() {
        if (platinum.sub(this.plat_gain()).gte(0)) {
            return new Decimal(0);
        }
        else return this.plat_gain().sub(platinum);

    },
    next_plat:function() {
        base_pow = reboot_decimal(10);
        if (prestigeT1_MS.platinum_obtained[7]==true) {
            base_pow = reboot_decimal(2);
        }
        next_p = new Decimal(1);
        next_p = next_p.mul(base_pow).pow(platinum.add(prestigeT1.gain_plat().add(1))).mul(1e19).floor();
        return next_p;
    },
    confirmPrT1: function() {
        if (prestigeT1.confirm == false) {
            platinum = platinum.add(prestigeT1.gain_plat());
            platinum_multi = platinum.add(1).pow(2).round();
            this.prestige_time++;
    
            if (this.unlock_ach_milestone == false) {this.unlock_ach_milestone=true}
            prestigeT1_MS.check();
            this.resetT1();

        }else {
        if (confirm("Do you want to alchemise all of your accumlated gold up to this point for platinum?")) {
        //platinum gain
        platinum = platinum.add(prestigeT1.gain_plat());
        platinum_multi = platinum.add(1).pow(2).round();
        this.prestige_time++;

        if (this.unlock_ach_milestone == false) {this.unlock_ach_milestone=true}
        prestigeT1_MS.check();
        this.resetT1();
        }
        }

    },
    resetT1:function() {
        
        //gold and core-game
        if (prestigeT1_MS.platinum_obtained[2] == false) {
            gold = new Decimal(15);
        } else {gold = new Decimal(1e5)}
        
        game.timer = 30;
        global_mul = new Decimal(1);
        global_exp = new Decimal(1);
        game_prestige_time = new Decimal(0);
        //building
        for (i = 0;i<building.name.length;i++) {
            building.count[i] = new Decimal(0);
            building.multi[i] = new Decimal(1);
            building.cost[i] = building.base_cost[i];
        }
        if (prestigeT1_MS.platinum_obtained[3] == false) {
        building.cur_tier = 0;
        } 
        else building.cur_tier = 8;
        //upgrade-general
        if (prestigeT1_MS.platinum_obtained[3] == false) {
            for (i = 0;i<upgrade.name.length;i++) {
            upgrade.purchased[i] = false;
            upgrade.multi[i] = new Decimal(1);
            }
        }
        
        //willpower-determination
        wife_willpower=new Decimal(0);
        wife_determination=new Decimal(0);
        wife_determination_cost= new Decimal(32);
        wife_determination_multi= new Decimal(1);
        //temporary
        if (prestigeT1_MS.platinum_obtained[4]==false) {
            wife.level = 0;
        }
        
        //prayer
        prayer_cost = new Decimal(100);
        for (i = 0;i<prayer.count.length;i++) {
            prayer.count[i] = 0;
        }
        prayer.danger = 0;
        display.updateGold();
        display.updateShop();
        display.updateTime();
        display.updatePrayer();
        display.updatePrayerThreat();
        display.updateWife();
        display.updatePlatinum();
        display.updateMusic(0);
    }

}
var prestigeT1_MS = {
    platinum_req:[
        1,
        3,
        5,
        7,//3
        15,
        30,
        75,//6
        200,
        800,
        3000,//9
        10000,
    ],
    platinum_desc:[
        "You now automatically pray whenever timer reaches 0 if you have enough gold",//0
        "Platinum multiplier now affects willpower gain and Determination become more powerful. x → (x+1)<sup>2</sup>",
        "You automatically purchase buildings start from cheapest if the price is 1/10 of your gold. Also, you start with 100,000 gold each prestige",
        "General Upgrade now affects all buildings. You keep General Upgrade through Alchemy",//3
        "You keep your wife! And your wife rank II's effect is now much stronger (log<sub>10</sub>(x) → x<sup>1+log<sub>10</sub>(x)</sup>). You can now start to have children with one another. ",
        "General Upgrade now affects all buildings with better formula. x → (x+1)<sup>2</sup> ",
        "General Upgrade formula is much stronger. log<sub>10</sub>(x<sub>i</sub>)<sup>10-i</sup> → log<sub>10</sub>(Σ<sup>k</sup><sub>i=0</sub> x<sub>i</sub>)<sup>10-i",
        "Platinum gain formula is improved. ⌊log<sub>10</sub>(x+1/(1*10<sup>19</sup>)⌋ → ⌊log<sub>2</sub>(x+1/(1*10<sup>19</sup>))⌋",//7
        "Bloodline bonds gain is now affected by your significant's rank II effect.",//8
        "Determination effects are now boosted by its amount. (x+1)<sup>2</sup> → (x+1)<sup>2+log<sub>2</sub>(x)</sup>",//9
        "<span style ='font-weight:bolder'> Unlock Titanium </span>  ",
    ],
    platinum_obtained:[
        false,false,false,false,false,false,false,false,false,false,false,
    ],
    check:function() {
        for (i=0;i<prestigeT1_MS.platinum_req.length;i++) {
            if (platinum.gte(this.platinum_req[i]) && this.platinum_obtained[i] != true) {
                this.platinum_obtained[i] = true;
            }
        }
    },
    PrT1_MS1:function() {
        if (prestigeT1_MS.platinum_obtained[1] == true) {
            return (platinum.add(1).pow(platinum.log2()));
        }
        else return 1;
    },
    PrT1_MS3:function() {
        if (prestigeT1_MS.platinum_obtained[3]== true) {
            TMU = new Decimal(1);
            for (i=0;i<building.multi.length;i++) {
                temp = new Decimal(building.multi[i]);
                TMU = TMU.mul(this.PrT1_MS5(temp));
            }
            if (TMU.lte(1)) {
                return 1;
            }
            return TMU;

        }
        else return 1;
    },
    PrT1_MS5:function(num) {
        number = new Decimal(num);
        if (prestigeT1_MS.platinum_obtained[5] == true) {
            return number.add(1).pow(2);
        }
        else return number;
        

    },
    PrT1_MS8:function() {
        if (prestigeT1_MS.platinum_obtained[8] == true) {
            return wife.wiferankII();
        }
        return 1;
    },
    PrT1_MS9:function() {
        if (prestigeT1_MS.platinum_obtained[9] == true) {
            return wife.wiferankII();
        }
        return 1;
    }
}
var kingdom = {
    restructures_time: new Decimal(0),
    restructures_cost: new Decimal(1e150),
    buildings:new Decimal(0),
    base_cost:new Decimal(15),
    current_cost:new Decimal(15),
    restructure:function() {
        temp = new Decimal(this.restructures_cost);
        temp_count = new Decimal(this.restructures_time);
        this.restructures_time = temp_count.add(1);
        this.restructures_cost = temp.mul(1e50).pow(2);
        display.updateKingdom();
        display.updateGold();
    },
    restructure_bonus:function() {
        temp = new Decimal(this.restructures_time);
        if (temp.equals(0)) {
            return 1;
        }
        return temp.add(1).pow(2).div(10).add(1);

    },
    purchase_buildings:function() {
        if(gold.gte(this.current_cost)) {
            kingdom.buildings = reboot_decimal(kingdom.buildings);

            kd_purchase_count = Decimal.affordGeometricSeries(gold,this.base_cost,1.1,kingdom.buildings);
            kd_cost_increase = Decimal.sumGeometricSeries(gold,this.base_cost,1.1,kingdom.buildings);
            kingdom.buildings = kingdom.buildings.add(kd_purchase_count);
            kingdom.current_cost = this.current_cost.add(kd_cost_increase);
        }
    },
    total_buildings:function() {
        temp = new Decimal(this.buildings);
        temp_res = new Decimal(this.restructures_time);
        return temp.mul(8).mul(temp_res.add(1)).pow(1.1).round();

    },
    update_buildings:function() {
        temp = new Decimal(this.buildings);
        if (wife.level>=3 && temp.lt(building.count[0])) {
            kingdom.buildings = new Decimal(building.count[0]);
            kingdom.current_cost = new Decimal(building.cost[0]);

        }

    },
    autopurchasemk2:function() {
        while(this.current_cost.lte(gold)) {
            kingdom.purchase_buildings();
        }
    }
    

}
function time_penalty() {
    if (game_prestige_time.gte(300)) {
        return 1;
    }
    else return game_prestige_time.div(300);
}
var diplomacy = {

    name:[
        "Empire of Man",
        "Dwarves Dynasty",
        "Elven Coven",
    ],
    unlock:[ //save
        false,
        false,
        false,
    ],
    relationship:[ //save
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
    ],
    relationship_lvl:[ //save // my dumbass turned all of these into BreakEternity Decimal during passive income because I forgo so no,frelationship It is BE Decimal
        new Decimal(0),
        new Decimal(0),
        new Decimal(0),
    ],
    income:[ //save
        new Decimal(1),
        new Decimal(1),
        new Decimal(1),
    ],
    lvl_up_cost:[ //save
        new Decimal(1024),
        new Decimal(1024),
        new Decimal(1024),
    ],
    faction_req_counter:[ //save
        0,
        0,
        0,
    ],
    lvl_req:[
        2,
        5,
        7,
        11,
        15,
    ],
    income:[
        1,
        1,
        1,
    ],

    bonus_desc:[
        ["Total buildings now affects diplomacy gain with Empire of Man at a reduced effect (log<sub>2</sub>(x))",
        "Relationship bonus is stronger based Platinum",
        "",
        "",
        "",
    
        ],
        [
            "",
            "",
            "",
            "",
            "",
        ],
        [
            "",
            "",
            "",
            "",
            "",
        ],


    ],
    bonus_check:[ //save
        [
        false,
        false,
        false,
        false,
        false,
        ],
        [
            false,
            false,
            false,
            false,
            false,
        ],
        [
        false,
        false,
        false,
        false,
        false,
        ],
            
    ],
    all_diplomacy_strengthen: function() {
        
        for (i=0;i<diplomacy.name.length;i++) {
            diplomacy.relationship[i] =reboot_decimal(diplomacy.relationship[i]);
            diplomacy.relationship_lvl[i] = reboot_decimal(diplomacy.relationship_lvl[i]);
            diplomacy.lvl_up_cost[i] = reboot_decimal(diplomacy.lvl_up_cost[i])


            if (diplomacy.unlock[i]==true) {
                diplomacy.relationship[i] = diplomacy.relationship[i].add(this.getDPS(i));
            }
            
            if (reboot_decimal(diplomacy.relationship[i]).gte(diplomacy.lvl_up_cost[i])) {
                while(diplomacy.relationship[i].gte(diplomacy.lvl_up_cost[i])) {
                    diplomacy.relationship_lvl[i]=diplomacy.relationship_lvl[i].add(1);
                    diplomacy.lvl_up_cost[i]=diplomacy.lvl_up_cost[i].pow(2);
                }
            }
            if (reboot_decimal(diplomacy.relationship_lvl[i]).gte(diplomacy.lvl_req[diplomacy.faction_req_counter[i]])) {
                if (diplomacy.faction_req_counter[i] < diplomacy.lvl_req.length) {
                    diplomacy.bonus_check[i][diplomacy.faction_req_counter[i]] == true;
                    diplomacy.faction_req_counter[i]++;
                }
            }
        }
        diplomacy.opportunity = reboot_decimal(diplomacy.opportunity).add(diplomacy.opportunity_gain())
    },
    getDPS:function(index) {
        temp_income = new Decimal(diplomacy.income[index]);
        return temp_income.mul(reboot_decimal(1).add(this.opportunity_gain().log10())).round();
    },
    count_unlock:function() {
        check_count = 0;
        for (i = 0;i< diplomacy.unlock.length;i++) {
            if (diplomacy.unlock[i] == true) {
                check_count++;
            }
        }
        return check_count;
    },
    passive_diplo_bonus:function(index) {
        temp_dip = new Decimal(diplomacy.relationship[index])
        if (index == 0) {
            return temp_dip.pow(5).mul(this.proposal.effect_formula[1]()).round();
        }
        if (index == 1) {
            return temp_dip.add(1).log10().pow(temp_dip.add(1).log10()).mul(this.proposal.effect_formula[1]()).round();
        }
        if (index == 2) {
            return temp_dip.add(1).log2().log2().pow(temp_dip.add(1).log10()).mul(this.proposal.effect_formula[1]()).round();
        }

    },
    passive_diplo_bonus_text:function(index) {
        if (index == 0) {
            return "*"+format(this.passive_diplo_bonus(index)) + " bonus to GPS."
        }
        if (index == 1) {
            return "*"+format(this.passive_diplo_bonus(index)) + " bonus to Rare Metal gain."
        }
        if (index == 2) {
            return "*"+format(this.passive_diplo_bonus(index)) + " bonus to Magic gain."
        }
    },
    relationship_lvl_effect:function(index) {
        temp_text = "";
        for (rle = 0; rle<diplomacy.bonus_desc[index].length;rle++) {
            if (diplomacy.bonus_check[index][rle] == true) {
                temp_text+= "Lvl "+diplomacy.lvl_req[rle] + ":"+diplomacy.bonus_desc[index][rle] + "<br>";
            }
            
        }
        return temp_text;

    },

    //diplomacy currency
    opportunity: new Decimal(0),//save
    opportunity_gain: function() {
        opg = new Decimal(1);
        def_base_gold = new Decimal(100);
        def_base_platinum = new Decimal(20);
        opg = gold.add(1).log(def_base_gold.div(this.proposal.effect_formula[2]())).mul(platinum.add(1).log(def_base_platinum.div(this.proposal.effect_formula[4]()))).mul(this.proposal.effect_formula[0]()).mul(reboot_decimal(kingdom.buildings).pow(this.proposal.effect_formula[3]())).pow(this.proposal.effect_formula[5]());
        return opg.pow(bloodline.Lucia_bonus()).round();

    },
    proposal:{
        cost:[new Decimal(500), new Decimal(1000), new Decimal(5000), new Decimal(10000), new Decimal(30000), new Decimal(100000),],//save
        count:[
            new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),
        ],//save
        sign:[
            "*","*","/",
            "^","/","^",

        ],
        effect_formula:[
            function(){return reboot_decimal(diplomacy.proposal.count[0]).add(1).pow(2).round()},
            function(){return reboot_decimal(diplomacy.proposal.count[1]).add(1).pow(2).round()},
            function(){return reboot_decimal(diplomacy.proposal.count[2]).div(20).add(1).toFixed(2)},

            function(){return reboot_decimal(diplomacy.proposal.count[3]).div(20).toFixed(2)},
            function(){return reboot_decimal(diplomacy.proposal.count[4]).div(10).add(1).toFixed(2)},
            function(){return reboot_decimal(diplomacy.proposal.count[5]).div(100).add(1).toFixed(2)},

        ],

        
        purchasing_formula:[
            function(){return reboot_decimal(diplomacy.proposal.cost[0]).pow(1.05).mul(2).round()},
            function(){return reboot_decimal(diplomacy.proposal.cost[1]).pow(1.05).mul(2).round()},
            function(){return reboot_decimal(diplomacy.proposal.cost[2]).pow(1.05).mul(3).round()},
            function(){return reboot_decimal(diplomacy.proposal.cost[3]).pow(1.05).mul(3).round()},
            
            function(){return reboot_decimal(diplomacy.proposal.cost[4]).pow(1.05).mul(5).round()},
            function(){return reboot_decimal(diplomacy.proposal.cost[5]).pow(1.1).mul(5).round()},

        ],
        desc:[  "Increase opportunity gain",
                "Increase relationship effect",
                "Increase opportunity gain by dividing gold base log",
                "Increase opportunity gain by buildings",
                "Increase opportunity gain by dividing platinum base log",
                "Opportunity gain slight power base",
             ],
        purchase:function(index) {
            if (diplomacy.opportunity.gte(diplomacy.proposal.cost[index])) {
                dpct =reboot_decimal(diplomacy.proposal.count[index]);

                diplomacy.proposal.count[index] = dpct.add(1);
                
                diplomacy.opportunity = diplomacy.opportunity.sub(diplomacy.proposal.cost[index]);
                diplomacy.proposal.cost[index] = diplomacy.proposal.purchasing_formula[index]();
                

                display.updateDiplomacy();
                display.updateGold();
                display.updateWife();

            }
            
        },
        proposal_text:function() {
            temp_text = "";
            for (pti = 0; pti<6;pti++) {
                temp_text+='<br><tr><td ><button class="standard" onclick="diplomacy.proposal.purchase('+pti+')">'+diplomacy.proposal.desc[pti]+' ('+diplomacy.proposal.sign[pti]+format(diplomacy.proposal.effect_formula[pti]())+')<br> Cost:'+format(diplomacy.proposal.cost[pti])+'</button></td></tr>'
                
            }
            return temp_text;

        }
    }
}
function reboot_decimal(num) {
    number = new Decimal(num);
    return number;
}
//achievement (warning: very long due to shoddy early coding and traumatic interaaction with for loop memory clash )
var achievement = {
    id:[["11","12","13","14","15","16","17","18"],
    ["21","22","23","24","25","26","27","28"],
    ["31","32","33","34","35","36","37","38"],
    ],
    name:[
        ["So it begins",
        "A small loan of million dollars",
        "Bite za dusto!",
        "It's a beautiful day outside",

        "Why don't you earn some bitches",
        "Know your herb",
        "Hyper-inflation",
        "Weight of the World"
        ],
        ["Back to the Past",
        "Birds were singing, flowers were blooming",
        "Shocking Realization",
        "An arduous journey ended",

        "Maternity",
        "Megalomania",
        "Fatherless no more",
        "Carrying the Universe"
        ],
        ["God saves the Queen",
        "Family guy moment",
        "Folks like you, should be burning in hell",
        "Can't escape from crossing fate",

        "Interstellar Retribution",
        "EV Age! Sorry, wrong game.",
        "For the Imperium!",
        "Nothing is stronger than family"]
        
    ],
    obtained:[
        [false,false,false,false,
            false,false,false,false],
        [false,false,false,false,
            false,false,false,false],
        [false,false,false,false,
            false,false,false,false],
    ],
    bonus:[
        [false,false,false,false,
            false,false,true,false],
        [false,true,false,false,
            true,true,true,true],
        [false,false,false,false,
            false,false,false,false] 
            
    ],
    desc:[
        ["Obtain your first Herb Scrounging",
         "Have 1,000,000 gold",
         "Prayed for the first time",
         "Obtain 1 Determination",
         
         "Advance your relationship rank to II",
         "Purchase all of General upgrade",
         "Reach 1*10<sup>20</sup> GPS while having prayed less than 5 times",
         "Have 6*10<sup>24</sup> gold this prestige"
        ],
        ["Alchemise for your first time.",
        "Have 40 Determination",
        "Reach 1*10<sup>32</sup> golds within 960 seconds",
        "Have 15 Platinum",

        "Do the deed with your wife for the first time",
        "Prayed a total of 5 times after reaching 1*10<sup>32</sup> GPS",
        "Have 10,000 bonds with your firstborn son",
        "Have 1*10<sup>53</sup> golds within this prestige"
        ],
        [
            "Advance your relationship rank to IV",
            "Interact with your children 100 times total",
            "Have 150 Determination this prestige",
            "Have prayer cost exceed 1*10<sup>1,000</sup> golds",

            "Prayed a total of 5 times after prayer cost is above 1*10<sup>100</sup> golds",
            "Obtain Titanium",
            "Reach Lv.2 diplomacy with Empire of Man",
            "Have 200 Determination and 200 interaction time with your children",
        ]
    ],
    reward:[
        [
        "",
        "",
        "",
        "",

        "",
        "",
        "Reward: GPS is multiplied based on its amount and current time in this prestige",
        "",
        ],
        [
            "",
            "Reward:Your significant's rank III effect become more powerful <br> [(30-x) → (30-x)<sup>log<sub>10</sub>(30-x)</sup>] ",
            "",
            "",
    
            "Reward: Your significant's rank III effect no longer reduce when timer is above 15",
            "Reward: GPS gain a prayer bonus based on respective danger level",
            "Reward: Your bloodline's bond gains is boosted by Platinum multiplier",
            "Reward: GPS gain slight power based on gold.",
        ],
        [
            "",
            "",
            "",
            "",
    
            "",
            "",
            "",
            "",
        ],


    ],
    display_desc:function(x,y) {
        return "<div>"+achievement.desc[x][y]+"</div>"
    },
    display_reward:function(x,y) {
        if (achievement.reward[x][y].toString() !== "") {
            return "<div class = 'button'>"+achievement.reward[x][y]+"</div>";
        }
        else return "";

    },
    bonus_mod:[
        [function(){return 1},//0
            function(){return 1},
            function(){return 1},
            function(){return 1},//3
            function(){return 1},
            function(){return 1},
            function(){return achievement.achievement_bonus06()},//6
            function(){return 1}],//7
        [function(){return 1},//0
            function(){return wiferankIII()},
            function(){return 1},
            function(){return 1},//3
            function(){return wiferankIII()},
            function(){return achievement.achievement_bonus15()},
            function(){return achievement.achievement_bonus16()},//6
            function(){return achievement.achievement_bonus17()},//7
        ],
        [function(){return 1},//0
            function(){return 1},
            function(){return 1},
            function(){return 1},//3
            function(){return 1},
            function(){return 1},
            function(){return achievement.achievement_bonus06()},//6
            function(){return 1}],//7
    
    ],
    bonus_function:[
        ["","","","",
        "","","*",""
        ],
        ["","*","","",
        "*","*","*","^"],
        ["","","","",
        "","","",""
        ],

    ],
    bonus_type:[
        [
            "","","","",
            "","","GPS",""
        ],
        [ 
            "","GPS","","",
            "Misc","GPS","Misc","GPS"
        ],
        [
            "","","","",
            "","","","",
        ],

    ],
    bonus_check:function(x,y) {
        if (this.bonus[x][y] == true && this.obtained[x][y] == true && this.bonus_type[x][y].toString() !== "") {
            temp = new Decimal(achievement.bonus_mod[x][y]());
            return "<div class='button'>Currently:"+this.bonus_function[x][y] + format(temp.toFixed(2)) +"</div>";
        }
        return "";
    },
    check_function:[
        [// 11-18(row 0)
            function(){if(building.count[0] >=1 && achievement.obtained[0][0]!=true){return true} else return false},
            function(){if (gold.gte(1e6) && achievement.obtained[0][1]!=true) {return true} else return false},
            function(){if (prayer.count[0]>=1 && achievement.obtained[0][2]!=true) {return true} else return false},
            function(){if (wife_determination.gte(1) && achievement.obtained[0][3]!=true) {return true} else return false},

            function(){if (wife.level>=1 && achievement.obtained[0][4]!=true) {return true} else return false},
            function(){if (upgrade.checkall() && achievement.obtained[0][5]!=true) {return true} else return false},
            function(){if (getGPS().gte(1e20) && prayer.count[0] <=5 && achievement.obtained[0][6]!=true) {return true} else return false},
            function(){if (gold.gte(6e24) && achievement.obtained[0][7]!=true) {return true} else return false},

        ],
        [ // 21-28(row 1)
            function(){if (prestigeT1.prestige_time>=1 && achievement.obtained[1][0]!=true) {return true} else return false},
            function(){if (wife_determination.gte(40) && achievement.obtained[1][1]!=true) {return true} else return false},
            function(){if (prayer.danger >=1 && achievement.obtained[1][2]!=true) {return true} else return false},
            function(){if (platinum.gte(15) && achievement.obtained[1][3]!=true) {return true} else return false},

            function(){if (bloodline.kinCount() >=1 && achievement.obtained[1][4]!=true) {return true} else return false},
            function(){if (prayer.danger>=1 && prayer.count[1] >=5 && achievement.obtained[1][5]!=true) {return true} else return false},
            function(){temp16 = new Decimal(bloodline.bond[0]);if (temp16.gte(1e4) && achievement.obtained[1][6]!=true) {return true} else return false},
            function(){if (gold.gte(1e53) && achievement.obtained[1][7]!=true) {return true} else return false},


        ],
        [ // 31-38(row 2)
            function(){if (wife.level>=3) {return true} else return false},
            function(){if (bloodline.total_interact_time().gte(100)) {return true} else return false},
            function(){if (wife_determination.gte(150)) {return true} else return false},
            function(){if (prayer_cost.gte("1e1000")) {return true} else return false},

            function(){if (prayer.total_prayer_count(1).gte(5)) {return true} else return false},
            function(){if (prestigeT1_MS.platinum_obtained[10]==true){return true} else return false},
            function(){if (reboot_decimal(diplomacy.relationship_lvl[0]).gte(2)) {return true} else return false},
            function(){if (wife_determination.gte(200) && bloodline.total_interact_time().gte(200) ) {return true} else return false},


        ],
    ],
    //achievement bonus
    achievement_bonus06:function() {
        if (achievement.obtained[0][6] == true) {
            if(gold.add(1).log10().mul(time_penalty()).lte(1)) {
                return 1;
            }
            return gold.add(1).log10().mul(time_penalty());
        }else return 1;
    },
    achievement_bonus15:function() {
        if(achievement.obtained[1][5] == true) {
            TP = new Decimal(0);
            for (k =0;k<prayer.count.length;k++) {
                temp = new Decimal(prayer.count[k]);
                TP = TP.add(temp.pow(k));
            }
            if (TP.lte(1)) {return 1};
            return TP;
        } 
        return 1;

    },
    achievement_bonus16:function() {
        if (achievement.obtained[1][6] == true) {
            return platinum_multi;
        }
        return 1;
    },
    achievement_bonus17:function() {
        if (achievement.obtained[1][7] == true) {
            if(gold.add(1).log10().add(1).log10().div(8).mul(time_penalty()).add(1).lte(1)) {
                return 1;
            }
            return gold.add(1).log10().add(1).log10().div(8).mul(time_penalty()).add(1);
        }
        return 1;
    },
    all_achievement_mul:function() {
        AM = new Decimal(1);
        for (i=0;i<achievement.id.length;i++) {
            for (j=0;j<achievement.id[i].length;j++) {
                if (achievement.obtained[i][j] == true && achievement.bonus[i][j] == true && achievement.bonus_type[i][j].toString() == "GPS") {
                    if (achievement.bonus_function[i][j]=="*") {
                        AM = AM.mul(achievement.bonus_mod[i][j]());
                    }
                }
            }
        }
        return AM;

    },
    all_achievement_exp:function() {
        AE = new Decimal(1);
        for (i=0;i<achievement.id.length;i++) {
            for (j=0;j<achievement.id[i].length;j++) {
                if (achievement.obtained[i][j] == true && achievement.bonus[i][j] == true && achievement.bonus_type[i][j].toString() == "GPS") {
                    if (achievement.bonus_function[i][j]=="^") {
                     AE = AE.mul(achievement.bonus_mod[i][j]());
                    }
                }
            }
        }
        return AE;

    },
    
    check:function() {
        for (row=0;row<achievement.check_function.length;row++) {
            for (col=0;col<achievement.check_function[row].length;col++) {
                if (achievement.obtained[row][col] != true && achievement.check_function[row][col]() == true) {
                    achievement.obtained[row][col] = true;
                    
                    display.updateAchievement();
                    display.updateAchievementNotification(row,col);
                }
            
            }
        }
        
    }
}

var display = {
    updateGold: function() {
        document.getElementById("gold").innerHTML = format(gold);
        document.getElementById("gps").innerHTML ="GPS: "+ format(getGPS());

    },
    updateShop: function() {
        document.getElementById("shopContainer").innerHTML = ""
        if (wife.level < 3) {
            for (i=0; i<=building.cur_tier; i++) {
            if (i>=8) {
                break;
            }
            document.getElementById("shopContainer").innerHTML += '<table class=" shop_container" onclick="building.purchase('+i+')"><tr><td id="image"><img src="ingame_pic/'+building.image[i]+'"></td><td id="nameandCost"><p>'+building.name[i]+'</p><p><span>'+format(building.cost[i])+'</span> gold</p></td><td id="gps"><p>'+format(getIndexGPS(i))+' GPS</p></td><td id="amount"><span>'+format(building.count[i])+'</span></td></tr></table>';
        }

        }
        

    },
    updatePrayer:function() {
        document.getElementById("Prayer").innerHTML = '<table class="pray_container '+prayer.warning()+'" onclick="prayer.pray()"><tr><td id="image"><img src="ingame_pic/'+prayer.img+'"></td><td id="nameandCost"><p>'+prayer.last_prayer_trigger()+'</p><p><span>'+format(prayer_cost)+'</span> gold</p></td></table>'
    },
    updatePrayerThreat:function() {
        document.getElementById("PrayerThreat").innerHTML = prayer.threat[prayer.danger];
    },
    updateAutoBuilding:function() {
        if (prestigeT1_MS.platinum_obtained[2] == false) {document.getElementById("autoBuilding").innerHTML = ""}
        else document.getElementById("autoBuilding").innerHTML = '<table class=" auto_container" onclick="building.toggle_autopurchase()"><tr><td id="image"><img src="ingame_pic/cog_autobuild.png"></td><td id="nameandCost"><p>Auto-purchase buildings</p><p>'+building.check_autobuilding()+'</p></td></table>'
        if (wife.level >= 3){document.getElementById("autoBuilding").innerHTML = ""}
    },
    updateTime: function() {
        document.getElementById("timer").innerHTML = game.timer.toFixed(2);
        document.getElementById("timer").style.color = rgb(((30-game.timer)/45)*255,0,0)
    },
    updateMusic:function(index) {
        document.getElementById("musicPlayer").innerHTML='<audio id="musicPlayer" controls autoplay loop><source src ="bg_music/'+musicplayer.name[index]+'" type="audio/mp3"></audio><p style="font-family:Georgia"> Playing: '+musicplayer.name[index]+'</p>'

    },
    updateWife:function() {
        if (wife.level >= 2 && prestigeT1_MS.platinum_obtained[4] == true) {
            document.getElementById("wifeContainer").innerHTML='<table class = "wifeContainer"><tr id="rank"><td><p> Rank '+ wife.rank[wife.level]+'</p></td></tr><tr id="image"><td><center><img src="ingame_pic/wife/'+wife.img[wife.level]+'"</td></center></tr><tr id="description"><td><p style="font-size:12px">'+wife.desc[wife.level]+'</p></td></tr><tr id="effect"><td><p style="font-size:12px">'+wife.effectList()+'</p></td></tr><tr id="determination"><td><p>You have <span style="font-size:36px">'+format(wife_willpower)+'</span> willpower ('+format(wife.getWPS())+' willpower/s) which convert into <span style="font-size:36px">'+format(wife_determination)+'</span>'+wife.determulti()+' Determination . Your next Determination is at <span style="font-size:36px">'+format(wife_determination_cost)+'</span></p></td></tr><tr id="breed"><td><button  onclick="wife.breed()" class="button"> Do the deed with her (The whole point that you married her, you know?) ('+format(wife.breed_cost[wife.breed_lvl])+' gold)'+'</button></td></tr><tr id="unlock"><td><button  onclick="wife.purchase()" class="button"> '+wife.upgrade[wife.level]+' ('+format(wife.cost[wife.level])+' gold)'+'</button></td></tr></table>'
        }
        else document.getElementById("wifeContainer").innerHTML='<table class = "wifeContainer"><tr id="rank"><td><p> Rank '+ wife.rank[wife.level]+'</p></td></tr><tr id="image"><td><center><img src="ingame_pic/wife/'+wife.img[wife.level]+'"</td></center></tr><tr id="description"><td><p style="font-size:12px">'+wife.desc[wife.level]+'</p></td></tr><tr id="effect"><td><p style="font-size:12px">'+wife.effectList()+'</p></td></tr><tr id="determination"><td><p>You have <span style="font-size:36px">'+format(wife_willpower)+'</span> willpower ('+format(wife.getWPS())+' willpower/s) which convert into <span style="font-size:36px">'+format(wife_determination)+'</span>'+wife.determulti()+' Determination . Your next Determination is at <span style="font-size:36px">'+format(wife_determination_cost)+'</span></p></td></tr><tr id="unlock"><td><button  onclick="wife.purchase()" class="button"> '+wife.upgrade[wife.level]+' ('+format(wife.cost[wife.level])+' gold)'+'</button></td></tr></table>'
    },
    updateUpgrade:function() {
        document.getElementById("upgradeContainer").innerHTML="";
        for (ui=0;ui<building.cur_tier;ui++) {
            if (ui>=8) {
                break;
            }
            if(!upgrade.purchased[ui]) {
                document.getElementById("upgradeContainer").innerHTML+='<div class="tooltip"><span class = "tooltiptext">'+upgrade.desc[ui]+'</span><table class = "upgradeButton" onclick ="upgrade.purchase('+ui+')"><center><tr id="image"><td><img src="ingame_pic/'+upgrade.image[ui]+'"</td></center></tr><tr id="nameandCost"><td><center><p>'+upgrade.name[ui]+'</p><p>'+format(upgrade.cost[ui])+' gold</p></td></center></tr><tr id="multi"><td><center><p>*'+format(upgrade.upgradeMulti(ui).toFixed(2))+'</p></td></center></tr></table></div>'
            }
            else {
                document.getElementById("upgradeContainer").innerHTML+='<div class="tooltip"><span class = "tooltiptext">'+upgrade.desc[ui]+'</span><table class = "purchasedupgradeButton"><center><tr id="image"><td><img src="ingame_pic/'+upgrade.image[ui]+'"</td></center></tr><tr id="nameandCost"><td><center><p>'+upgrade.name[ui]+'</p><p>'+format(upgrade.cost[ui])+' gold</p></td></center></tr><tr id="multi"><td><center><p>*'+format(upgrade.upgradeMulti(ui).toFixed(2))+'</p></td></center></tr></table></div>'
            }
        }  
        
        
    },
    updatePlatinum:function() {
        document.getElementById("Prestige1").innerHTML="";
        tempcount = 0;
        for(i=0;i<prestigeT1.name.length;i++) {
            if (prestigeT1.unlock[i]==true) {
                tempcount++;
            } 
        }
        if (tempcount == 1) {
            document.getElementById("Prestige1").innerHTML='<table class ="prestige" style ="background-color:'+prestigeT1.color[0]+';"><tr><td id ="header">You currently have <span style="font-size:48px">'+ format(platinum) +' </span> '+prestigeT1.name[0]+' <img src="ingame_pic/'+prestigeT1.image[0]+'.png" style ="width:64px;height:64px" ></img> <br> which multiply your GPS by <span style="font-size:48px">*'+format(platinum_multi)+'</span> using the formula of <span style="font-size:48px">'+prestigeT1.formula[prestigeT1.formulaLvl]+'</span></td></tr><tr><td id="next"> Your next platinum is at '+format(prestigeT1.next_plat())+' gold </td></tr><tr><td id="reset"> <button class="standard" onclick="prestigeT1.confirmPrT1()"> Restart the run and gain '+format(prestigeT1.gain_plat())+' platinum</button></td></tr></table>';
        }
            

       
    },
    
    updateBloodline:function(){
        document.getElementById("unlockBloodline").innerHTML= "";
        document.getElementById("BloodlineContainer").innerHTML="";
        document.getElementById("siblingBond").innerHTML="";
        
        if (prestigeT1_MS.platinum_obtained[4] == true && bloodline.checkBloodline() == true) {
            
            document.getElementById("unlockBloodline").innerHTML= ' <button class="alchemy_milestone_button" onclick="openSecondTab(event,'+"'Bloodline'"+')">Bloodline</button>';
            if (bloodline.kinCount() >=2) { 
                document.getElementById("siblingBond").innerHTML="Your <span style='font-size:36px'>"+bloodline.kinCount()+"</span> children are granting each other <span style='font-size:36px'>^"+format(bloodline.sibling_bond().toFixed(2))+"</span> to each other's bonds gain.";
            }
            for (bli=0;bli<bloodline.name.length;bli++) {
                if (bloodline.check[bli] == true) {               
                document.getElementById("BloodlineContainer").innerHTML += '<div><table class ="bloodlineContainer" style = "background-color:'+bloodline.background_color[bli]+'"><tr><td id ="image"><center><img src="ingame_pic/bloodline/'+bloodline.img[bli]+'.png"></center></td></tr><tr><td id = "name"><span class="enlarge">'+bloodline.name[bli]+'</span>, '+bloodline.title[bli]+'</td></tr><tr><td id = "bond">Your '+bloodline.gender[bli]+' grants you <span style="font-size:36px">'+format(bloodline.bond[bli])+'</span> bonds ('+format(bloodline.getBPS(bli))+' bonds/s) which converts into <span class = "enlarge">^'+ format(bloodline.bond_exp(bli))+'</span> to GPS'+bloodline.heir_bonus(bli)+'.</td></tr><tr><td id="interact" class ="button">You have interacted with your '+bloodline.gender[bli]+' for <span style = "font-weight:bold">'+format(new Decimal(bloodline.interact_time[bli]))+'</span> times. Which grants <span style = "font-weight:bold">^'+format(bloodline.interact_bonus(bli).toFixed(2))+'</span> to bond gains and effect'+bloodline.heir_bonus(bli)+' <br> <button class="button" onclick="bloodline.interact('+bli+')">Spend some time with your '+bloodline.gender[bli]+' ('+bloodline.wait_timer[bli]+'s)</button></td></tr></table></div>'
                }
            }
            
        }
        
    },
    updateStastistic:function() {
        document.getElementById("totalGold").innerHTML= "You have made a total of "+ format(total_gold) + " gold through out this journey";
        document.getElementById("prestigeTime").innerHTML="You have spent "+ format(game_prestige_time)+" second(s) in this prestige";
        document.getElementById("prestigeAmount").innerHTML="You have prestiged "+ format(prestigeT1.prestige_time)+" time(s) through out this journey";
    },
    updateAchievementRow() {
        document.getElementById("achieve").innerHTML="";
        for (i = 0;i<achievement.id.length;i++) {
            document.getElementById("achieve").innerHTML+= '<div class="flexible" id="row'+i+'"></div>';
        }
        

    },
    updateAchievement() {
        display.updateAchievementRow();
        for (i = 0;i<achievement.id.length;i++) {
            document.getElementById("row"+i).innerHTML="";
            for (j = 0;j<achievement.id[i].length;j++) {
                if (achievement.obtained[i][j] == true) {
                    document.getElementById("row"+i).innerHTML+='<div class="tooltip"><span class = "tooltiptext">'+achievement.display_desc(i,j)+achievement.display_reward(i,j)+ achievement.bonus_check(i,j)+'</span><table class = "achievement_image" style="background-image: url(ingame_pic/achievement/'+achievement.id[i][j]+'.png); size="><tr><td><table class="achievement completed"><tr><td id="name"><p>'+achievement.name[i][j]+'<p></td></tr><tr><td></td></tr><tr id="id"><td>'+achievement.id[i][j]+'</td></tr></table></tr></table></div>'
                }
                else document.getElementById("row"+i).innerHTML+='<div class="tooltip"><span class = "tooltiptext">'+achievement.display_desc(i,j)+achievement.display_reward(i,j)+ achievement.bonus_check(i,j)+'</span><table class = "achievement_image" style="background-image: url(ingame_pic/achievement/'+achievement.id[i][j]+'.png);"><tr><td><table class="achievement"><tr><td id="name"><p>'+achievement.name[i][j]+'<p></td></tr><tr><td></td></tr><tr id="id"><td>'+achievement.id[i][j]+'</td></tr></table></tr></table></div>'

            }

        }

    },
    updateAchievementNotification:function(x,y) {
        document.getElementById("ach_notif").innerHTML='<table class ="achievement_notif"><tr><td id="image"><img src="ingame_pic/achievement/'+achievement.id[x][y]+'.png"></td><td id="name"><p style="font-weight: bold;">Achievement obtained!</p><p>'+achievement.name[x][y]+'</p></td></table>';
        document.getElementById("ach_notif").style.display = "block";
        setTimeout(function(){document.getElementById("ach_notif").style.display ="none"}, 4000) //activate notification

    },
    //Prestige T1 Milestone
    updatePrestige1Milestone:function() {
        document.getElementById("unlockAchMilestone").innerHTML= "";
        document.getElementById("Prestige1MS_platinum").innerHTML="";
        if (prestigeT1.unlock_ach_milestone == true) { 
            document.getElementById("unlockAchMilestone").innerHTML+= '<button class="alchemy_milestone_button" style ="background-color: gray;" onclick="openSecondTab(event,'+"'Alchemy Milestone'"+')">Alchemy Milestone</button>';
            document.getElementById("Prestige1MS_platinum").innerHTML+="<span style ='font-size: 36px; font-family:Georgia'>Platinum</span><br>";
            for (i=0;i<prestigeT1_MS.platinum_req.length;i++){
                if (prestigeT1_MS.platinum_obtained[i] == true) {
                    document.getElementById("Prestige1MS_platinum").innerHTML+= '<table class ="alchemy_milestone obtained" style = "background-color:green"><tr><td id ="req"> Req: '+format(prestigeT1_MS.platinum_req[i])+' platinum</td><td id="effect">'+prestigeT1_MS.platinum_desc[i]+'</td></tr></table>';
                }else document.getElementById("Prestige1MS_platinum").innerHTML+= '<table class ="alchemy_milestone"><tr><td id ="req"> Req: '+format(prestigeT1_MS.platinum_req[i])+' platinum</td><td id="effect">'+prestigeT1_MS.platinum_desc[i]+'</td></tr></table>'
            }
        }
    },
    //confirm PrestigeT1
    
    updatePrestigeT1Confirmation:function() {
        document.getElementById("prestigeConfirmation").innerHTML = "";
        if (prestigeT1.unlock_ach_milestone == true) {
            document.getElementById("prestigeConfirmation").innerHTML += "<table class='confirm prestigeT1' onclick='prestigeT1.toggleConfirmation()'><tr><td id ='image'><img src='ingame_pic/Platinum.png'></td></tr><tr><td id='status'>"+prestigeT1.confirmcheck()+"</td></tr></table>";
        }

    },
    //Kingdom
    updateKingdom:function() {
        document.getElementById("kingdom").innerHTML = "";
        if (wife.level>=3) {
            document.getElementById("shopContainer").innerHTML = ""
            document.getElementById("kingdom").innerHTML = '<br><table class="kingdom"><tr><td id="image"><img src="ingame_pic/Kingdom.png"></td></tr><tr ><td id="effect"><div>Your kingdom has a total of <span class="enlarge">'+format(kingdom.total_buildings())+'</span> buildings which through restructuring now increase GPS by <span class="enlarge">^'+format(wife.wiferankIV().toFixed(2))+'</span>. You have restructured the logistic of your kingdom <span class="enlarge">'+format(kingdom.restructures_time)+'</span> times </div></td></tr><tr><td><button class="button" onclick="kingdom.restructure()">Restructures your kingdom'+"'"+'s logistic ('+format(kingdom.restructures_cost)+' gold) </button></td></tr></table>'
        }

    },
    updateDiplomacy:function() {
        document.getElementById("unlockDiplomacy").innerHTML= "";
        document.getElementById("diplomacy").innerHTML = "";
        document.getElementById("proposal").innerHTML = "";
        document.getElementById("opportunity").innerHTML = "";
        if (wife.level >= 3) {
            diplomacy.unlock[0] = true;
        }
        if (diplomacy.unlock[0] == true && wife.level >= 3) {
            document.getElementById("unlockDiplomacy").innerHTML+= '<button class="alchemy_milestone_button" onclick="openSecondTab(event,'+"'Diplomacy'"+')">Diplomacy</button>';
            document.getElementById("opportunity").innerHTML = 'You currently have <span class="enlarge">'+format(diplomacy.opportunity)+'</span> Opportunity (+'+format(diplomacy.opportunity_gain())+'/s)'
            document.getElementById("proposal").innerHTML = "<table class='proposal standard'><tr id='title'><td>Proposal</td></tr"+diplomacy.proposal.proposal_text()+"</table>";
            for (di = 0;di<diplomacy.unlock.length;di++) {
                if (diplomacy.unlock[di] == true) {
                    document.getElementById("diplomacy").innerHTML += "<table class = 'diplomacy'><tr><td id = 'image'><img src = 'ingame_pic/diploma/"+diplomacy.name[di]+".png'></td></tr><tr><td id = 'name'>"+diplomacy.name[di]+" </td></tr><tr><td id = 'effect'> You currently have <span class='standard'>"+format(diplomacy.relationship[di])+"</span> relationship ("+format(diplomacy.getDPS(di))+" relationship/s) with this faction. Which translates to Lv.<span class = 'standard'>"+format(diplomacy.relationship_lvl[di])+"</span> diplomacy and thus granting "+diplomacy.passive_diplo_bonus_text(di)+"<br></td></tr><tr><td id = 'effect' class = 'button'>"+diplomacy.relationship_lvl_effect(di)+" (Next level at "+format(reboot_decimal(diplomacy.lvl_up_cost[di]).round())+" relationship)</td></tr></table>";
                }
            }
        }
    }
 }
function rgb(r,g,b) {
    return "rgb("+r+","+g+","+b+")";
}
//save and reload
function save_game() {
    var gameSave = {
    save_gold : gold.toString(),
    save_totalGold:total_gold.toString(),
    save_glb_mul : global_mul.toString(),
    save_glb_exp : global_exp.toString(),
    save_timer : game.timer,//non breaketernity
    save_prestige_time:game_prestige_time,
    //building
    save_buildingCount : building.count,
    save_buildingCost : building.cost,
    save_buildingMulti : building.multi,
    save_shoptier:building.cur_tier,
    save_autobuilding: building.auto_building,
    //prayer
    save_prayer_cost: prayer_cost,
    save_reverse:prayer.reverse,
    save_prayer_count:prayer.count,
    save_prayer_danger:prayer.danger,
    //wife
    save_wife_level: wife.level,
    save_wife_willpower:wife_willpower,
    save_wife_determination:wife_determination,
    save_wife_determination_cost:wife_determination_cost,
    save_wife_determination_multi:wife_determination_multi,

    save_wife_breed:wife.breed_lvl, //x bloodline
    //general upgrade
    save_upgrade: upgrade.purchased,
    //platinum
    save_platinum: platinum,
    save_platinum_multi:platinum_multi,
    save_unlockPT1: prestigeT1.unlock,
    save_unlockPT1MS: prestigeT1.unlock_ach_milestone,
    save_plt_ms: prestigeT1_MS.platinum_obtained,
    save_totalprestige:prestigeT1.prestige_time,
    //achievement
    save_achievement:achievement.obtained,
    //bloodline
    
    save_bloodline: bloodline.check,
    save_bond: bloodline.bond,
    save_bond_time:bloodline.bond_time,
    save_interact_time: bloodline.interact_time,
    save_interact_timer:bloodline.wait_timer,
    //confirm prestige
    save_confirmPT1: prestigeT1.confirm,
    
    //kingdom
    save_restructure_time: kingdom.restructures_time,
    save_restructure_cost: kingdom.restructures_cost,
    save_kingdom_buildings: kingdom.buildings,
    save_kingdom_cost:kingdom.current_cost,
    //diplomacy
    save_diplomatic:diplomacy.relationship,
    save_diplomatic_level:diplomacy.relationship_lvl,
    save_diplomatic_check:diplomacy.bonus_check,
    save_diplomatic_level_cost: diplomacy.lvl_up_cost,
    save_diplomatic_req_counter: diplomacy.faction_req_counter,
    save_diplomatic_income:diplomacy.income,
    save_diplomatic_unlock:diplomacy.unlock,

    //opportunity
    save_opportunity: diplomacy.opportunity,
    save_proposal_cost:diplomacy.proposal.cost,
    save_proposal_count:diplomacy.proposal.count,
    }
    localStorage.setItem("game_save",JSON.stringify(gameSave)),
    console.log("saved game")
}
function load_game() {
    var savedGame = JSON.parse(localStorage.getItem("game_save"));
    if(localStorage.getItem("game_save")!== null) {
        if(typeof savedGame.save_prestige_time!== "undefined") {game_prestige_time = new Decimal(savedGame.save_prestige_time);}
        if(typeof savedGame.save_timer!== "undefined") {game.timer = savedGame.save_timer;}
        if(typeof savedGame.save_reverse!== "undefined") {game.reverse = savedGame.save_reverse;}
        if(typeof savedGame.save_gold!== "undefined"){ gold = new Decimal(savedGame.save_gold);}
        if(typeof savedGame.save_totalGold!== "undefined") {total_gold = new Decimal(savedGame.save_totalGold);}
        if(typeof savedGame.save_shoptier!== "undefined") {building.cur_tier = savedGame.save_shoptier;}

        if(typeof savedGame.save_buildingCount !== "undefined") {for(i=0;i<savedGame.save_buildingCount.length;i++){
        {building.count[i] = new Decimal(savedGame.save_buildingCount[i]);}
           };
        }
        if(typeof savedGame.save_buildingCost !== "undefined") {for(i=0;i<savedGame.save_buildingCost.length;i++){
            {building.cost[i] = new Decimal(savedGame.save_buildingCost[i]);}
               };
            }
        if(typeof savedGame.save_buildingMulti !== "undefined") {
            for(i=0;i<savedGame.save_buildingMulti.length;i++){
            {building.multi[i] = new Decimal(savedGame.save_buildingMulti[i]);}
               };
            }
        if(typeof savedGame.save_autobuilding !== "undefined") {building.auto_building = savedGame.save_autobuilding;}  
        if(typeof savedGame.save_global_multi !== "undefined") {global_multi = new Decimal(savedGame.save_glb_mul);}
        if(typeof savedGame.save_global_exp !== "undefined") {global_exp = new Decimal(savedGame.save_glb_exp);}
        //prayer
        if(typeof savedGame.save_prayer_cost!== "undefined") {prayer_cost = new Decimal(savedGame.save_prayer_cost);}
        if(typeof savedGame.save_reverse!== "undefined") {prayer.reverse = savedGame.save_reverse;}
        if(typeof savedGame.save_prayer_count!== "undefined") {
            for(i=0;i<savedGame.save_prayer_count.length;i++){
            prayer.count[i] = savedGame.save_prayer_count[i];
        }
        }
        if(typeof savedGame.save_prayer_danger!== "undefined") {prayer.danger= savedGame.save_prayer_danger;}
        //wife
        if(typeof savedGame.save_wife_level!== "undefined") {wife.level = savedGame.save_wife_level;}
        if(typeof savedGame.save_wife_willpower!== "undefined") {wife_willpower = new Decimal(savedGame.save_wife_willpower);}
        if(typeof savedGame.save_wife_determination!== "undefined") {wife_determination = new Decimal(savedGame.save_wife_determination);}
        if(typeof savedGame.save_wife_determination_cost!== "undefined") {wife_determination_cost = new Decimal(savedGame.save_wife_determination_cost);}
        if(typeof savedGame.save_wife_determination_multi!== "undefined") {wife_determination_multi = new Decimal(savedGame.save_wife_determination_multi);}
        //upgrade
        if(typeof savedGame.save_upgrade!== "undefined") {
            for (i=0;i<savedGame.save_upgrade.length;i++) {
                upgrade.purchased[i] = savedGame.save_upgrade[i];
            }
        }
        //platinum
        if(typeof savedGame.save_platinum!== "undefined") platinum = new Decimal(savedGame.save_platinum);
        if(typeof savedGame.save_platinum_multi!== "undefined") platinum_multi = new Decimal(savedGame.save_platinum_multi);
        if(typeof savedGame.save_unlockPT1!== "undefined") {
            for (i=0;i<savedGame.save_unlockPT1.length;i++) {
                prestigeT1.unlock[i] = savedGame.save_unlockPT1[i];
            }
        }
        if(typeof savedGame.save_platinum!== "undefined") prestigeT1.unlock_ach_milestone= savedGame.save_unlockPT1MS;
        if(typeof savedGame.save_plt_ms!== "undefined") {
            for (i=0;i<savedGame.save_plt_ms.length;i++) {
                prestigeT1_MS.platinum_obtained[i] = savedGame.save_plt_ms[i];
            }
        }
        if(typeof savedGame.save_platinum!== "undefined") prestigeT1.prestige_time = savedGame.save_totalprestige;
        //achievement
        if(typeof savedGame.save_achievement!== "undefined") {
            for (i=0;i<savedGame.save_achievement.length;i++) {
                for (j=0;j<savedGame.save_achievement[i].length;j++) {
                    achievement.obtained[i][j] = savedGame.save_achievement[i][j];
                }
                
            }
        }
        //bloodline
        if(typeof savedGame.save_bloodline!== "undefined") {
            for (i=0;i<savedGame.save_bloodline.length;i++) {
               bloodline.check[i] = savedGame.save_bloodline[i];
            }
        }
        if(typeof savedGame.save_bond!== "undefined") {
            for (i=0;i<savedGame.save_bond.length;i++) {
               bloodline.bond[i] = savedGame.save_bond[i];
            }
        }
        if(typeof savedGame.save_bond_time!== "undefined") {
            for (i=0;i<savedGame.save_bond_time.length;i++) {
               bloodline.bond_time[i] = savedGame.save_bond_time[i];
            }
        }

        if(typeof savedGame.save_interact_timer!== "undefined") {
            for (i=0;i<savedGame.save_interact_timer.length;i++) {
               bloodline.wait_timer[i] = savedGame.save_interact_timer[i];
            }
        }
        if(typeof savedGame.save_interact_time!== "undefined") {
            for (i=0;i<savedGame.save_interact_time.length;i++) {
               bloodline.interact_time[i] = savedGame.save_interact_time[i];
            }
        }

        if(typeof savedGame.save_wife_breed !== "undefined") {wife.breed_lvl = savedGame.save_wife_breed;}
        if(typeof savedGame.save_confirmPT1 !== "undefined") {prestigeT1.confirm = savedGame.save_confirmPT1;}
        //kingdom
        if(typeof savedGame.save_restructure_time!== "undefined") {kingdom.restructures_time = savedGame.save_restructure_time;}
        if(typeof savedGame.save_restructure_cost!== "undefined") {kingdom.restructures_cost = savedGame.save_restructure_cost;}
        if(typeof savedGame.save_building_cost!== "undefined") {kingdom.current_cost = savedGame.save_kingdom_cost;}
        if(typeof savedGame.save_kingdom_buildings!== "undefined") {kingdom.buildings = savedGame.save_kingdom_buildings;}
        //diplomacy
        if(typeof savedGame.save_diplomatic!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic.length;i++) {
                diplomacy.relationship[i] = savedGame.save_diplomatic[i]
            }
        }
        if(typeof savedGame.save_diplomatic_level!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_level.length;i++) {
                diplomacy.relationship_lvl[i] = savedGame.save_diplomatic_level[i]
            }
        }
        if(typeof savedGame.save_diplomatic_level_cost!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_level_cost.length;i++) {
                diplomacy.lvl_up_cost[i] = savedGame.save_diplomatic_level_cost[i]
            }
        }
        if(typeof savedGame.save_diplomatic_check!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_check.length;i++) {
                diplomacy.bonus_check[i] = savedGame.save_diplomatic_check[i]
            }
        }
        if(typeof savedGame.save_diplomatic_income!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_income.length;i++) {
                diplomacy.income[i] = savedGame.save_diplomatic_income[i]
            }
        }
        if(typeof savedGame.save_diplomatic_req_counter!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_req_counter.length;i++) {
                diplomacy.faction_req_counter[i] = savedGame.save_diplomatic_req_counter[i]
            }
        }
        if(typeof savedGame.save_diplomatic_check!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_check.length;i++) {
                diplomacy.bonus_check[i] = savedGame.save_diplomatic_check[i]
            }
        }

        //opportunity

        if(typeof savedGame.save_opportunity!== "undefined") { diplomacy.proposal.opportunity = savedGame.save_opportunity;}
        if(typeof savedGame.save_proposal_cost!=="undefined") {
            for (i=0;i<savedGame.save_proposal_cost.length;i++) {
                diplomacy.proposal.cost[i]= savedGame.save_proposal_cost[i];
            }
        }
        
        if(typeof savedGame.save_proposal_count!=="undefined") {
            for (i=0;i<savedGame.save_proposal_count.length;i++) {
                diplomacy.proposal.count[i]= savedGame.save_proposal_count[i];
            }
        }

    }

}
function reset_game() {
    var gameSave = {};
    localStorage.setItem("game_save",JSON.stringify(gameSave));
    window.location.reload();
    
}
function export_game() {
    save_game();
    var savedGame = JSON.parse(localStorage.getItem("game_save"));
    let inputField = document.getElementById("exportField");
    inputField.value = btoa(JSON.stringify(savedGame));
    inputField.select();
    document.execCommand("copy");
    alert("Game save copied to clipboard")

}
function import_game() {
    let loadGame = json.parse(atob(document.getElementById("exportField").value));
    if (loadGame && loadGame!=null && loadGame!="") {
        reset_game();
        load(loadGame);
        save_game();
    }

}
function load(loadGame) {
    var savedGame = loadGame;
    if(localStorage.getItem("game_save")!== null) {
        if(typeof savedGame.save_prestige_time!== "undefined") {game_prestige_time = new Decimal(savedGame.save_prestige_time);}
        if(typeof savedGame.save_timer!== "undefined") {game.timer = savedGame.save_timer;}
        if(typeof savedGame.save_reverse!== "undefined") {game.reverse = savedGame.save_reverse;}
        if(typeof savedGame.save_gold!== "undefined"){ gold = new Decimal(savedGame.save_gold);}
        if(typeof savedGame.save_totalGold!== "undefined") {total_gold = new Decimal(savedGame.save_totalGold);}
        if(typeof savedGame.save_shoptier!== "undefined") {building.cur_tier = savedGame.save_shoptier;}

        if(typeof savedGame.save_buildingCount !== "undefined") {for(i=0;i<savedGame.save_buildingCount.length;i++){
        {building.count[i] = new Decimal(savedGame.save_buildingCount[i]);}
           };
        }
        if(typeof savedGame.save_buildingCost !== "undefined") {for(i=0;i<savedGame.save_buildingCost.length;i++){
            {building.cost[i] = new Decimal(savedGame.save_buildingCost[i]);}
               };
            }
        if(typeof savedGame.save_buildingMulti !== "undefined") {
            for(i=0;i<savedGame.save_buildingMulti.length;i++){
            {building.multi[i] = new Decimal(savedGame.save_buildingMulti[i]);}
               };
            }
        if(typeof savedGame.save_autobuilding !== "undefined") {building.auto_building = savedGame.save_autobuilding;}  
        if(typeof savedGame.save_global_multi !== "undefined") {global_multi = new Decimal(savedGame.save_glb_mul);}
        if(typeof savedGame.save_global_exp !== "undefined") {global_exp = new Decimal(savedGame.save_glb_exp);}
        //prayer
        if(typeof savedGame.save_prayer_cost!== "undefined") {prayer_cost = new Decimal(savedGame.save_prayer_cost);}
        if(typeof savedGame.save_reverse!== "undefined") {prayer.reverse = savedGame.save_reverse;}
        if(typeof savedGame.save_prayer_count!== "undefined") {
            for(i=0;i<savedGame.save_prayer_count.length;i++){
            prayer.count[i] = savedGame.save_prayer_count[i];
        }
        }
        if(typeof savedGame.save_prayer_danger!== "undefined") {prayer.danger= savedGame.save_prayer_danger;}
        //wife
        if(typeof savedGame.save_wife_level!== "undefined") {wife.level = savedGame.save_wife_level;}
        if(typeof savedGame.save_wife_willpower!== "undefined") {wife_willpower = new Decimal(savedGame.save_wife_willpower);}
        if(typeof savedGame.save_wife_determination!== "undefined") {wife_determination = new Decimal(savedGame.save_wife_determination);}
        if(typeof savedGame.save_wife_determination_cost!== "undefined") {wife_determination_cost = new Decimal(savedGame.save_wife_determination_cost);}
        if(typeof savedGame.save_wife_determination_multi!== "undefined") {wife_determination_multi = new Decimal(savedGame.save_wife_determination_multi);}
        //upgrade
        if(typeof savedGame.save_upgrade!== "undefined") {
            for (i=0;i<savedGame.save_upgrade.length;i++) {
                upgrade.purchased[i] = savedGame.save_upgrade[i];
            }
        }
        //platinum
        if(typeof savedGame.save_platinum!== "undefined") platinum = new Decimal(savedGame.save_platinum);
        if(typeof savedGame.save_platinum_multi!== "undefined") platinum_multi = new Decimal(savedGame.save_platinum_multi);
        if(typeof savedGame.save_unlockPT1!== "undefined") {
            for (i=0;i<savedGame.save_unlockPT1.length;i++) {
                prestigeT1.unlock[i] = savedGame.save_unlockPT1[i];
            }
        }
        if(typeof savedGame.save_platinum!== "undefined") prestigeT1.unlock_ach_milestone= savedGame.save_unlockPT1MS;
        if(typeof savedGame.save_plt_ms!== "undefined") {
            for (i=0;i<savedGame.save_plt_ms.length;i++) {
                prestigeT1_MS.platinum_obtained[i] = savedGame.save_plt_ms[i];
            }
        }
        if(typeof savedGame.save_platinum!== "undefined") prestigeT1.prestige_time = savedGame.save_totalprestige;
        //achievement
        if(typeof savedGame.save_achievement!== "undefined") {
            for (i=0;i<savedGame.save_achievement.length;i++) {
                for (j=0;j<savedGame.save_achievement[i].length;j++) {
                    achievement.obtained[i][j] = savedGame.save_achievement[i][j];
                }
                
            }
        }
        //bloodline
        if(typeof savedGame.save_bloodline!== "undefined") {
            for (i=0;i<savedGame.save_bloodline.length;i++) {
               bloodline.check[i] = savedGame.save_bloodline[i];
            }
        }
        if(typeof savedGame.save_bond!== "undefined") {
            for (i=0;i<savedGame.save_bond.length;i++) {
               bloodline.bond[i] = savedGame.save_bond[i];
            }
        }
        if(typeof savedGame.save_bond_time!== "undefined") {
            for (i=0;i<savedGame.save_bond_time.length;i++) {
               bloodline.bond_time[i] = savedGame.save_bond_time[i];
            }
        }

        if(typeof savedGame.save_interact_timer!== "undefined") {
            for (i=0;i<savedGame.save_interact_timer.length;i++) {
               bloodline.wait_timer[i] = savedGame.save_interact_timer[i];
            }
        }
        if(typeof savedGame.save_interact_time!== "undefined") {
            for (i=0;i<savedGame.save_interact_time.length;i++) {
               bloodline.interact_time[i] = savedGame.save_interact_time[i];
            }
        }

        if(typeof savedGame.save_wife_breed !== "undefined") {wife.breed_lvl = savedGame.save_wife_breed;}
        if(typeof savedGame.save_confirmPT1 !== "undefined") {prestigeT1.confirm = savedGame.save_confirmPT1;}
        //kingdom
        if(typeof savedGame.save_restructure_time!== "undefined") {kingdom.restructures_time = savedGame.save_restructure_time;}
        if(typeof savedGame.save_restructure_cost!== "undefined") {kingdom.restructures_cost = savedGame.save_restructure_cost;}
        if(typeof savedGame.save_building_cost!== "undefined") {kingdom.current_cost = savedGame.save_kingdom_cost;}
        if(typeof savedGame.save_kingdom_buildings!== "undefined") {kingdom.buildings = savedGame.save_kingdom_buildings;}
        //diplomacy
        if(typeof savedGame.save_diplomatic!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic.length;i++) {
                diplomacy.relationship[i] = savedGame.save_diplomatic[i]
            }
        }
        if(typeof savedGame.save_diplomatic_level!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_level.length;i++) {
                diplomacy.relationship_lvl[i] = savedGame.save_diplomatic_level[i]
            }
        }
        if(typeof savedGame.save_diplomatic_level_cost!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_level_cost.length;i++) {
                diplomacy.lvl_up_cost[i] = savedGame.save_diplomatic_level_cost[i]
            }
        }
        if(typeof savedGame.save_diplomatic_check!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_check.length;i++) {
                diplomacy.bonus_check[i] = savedGame.save_diplomatic_check[i]
            }
        }
        if(typeof savedGame.save_diplomatic_income!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_income.length;i++) {
                diplomacy.income[i] = savedGame.save_diplomatic_income[i]
            }
        }
        if(typeof savedGame.save_diplomatic_req_counter!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_req_counter.length;i++) {
                diplomacy.faction_req_counter[i] = savedGame.save_diplomatic_req_counter[i]
            }
        }
        if(typeof savedGame.save_diplomatic_check!== "undefined") {
            for (i=0;i<savedGame.save_diplomatic_check.length;i++) {
                diplomacy.bonus_check[i] = savedGame.save_diplomatic_check[i]
            }
        }

        //opportunity

        if(typeof savedGame.save_opportunity!== "undefined") { diplomacy.proposal.opportunity = savedGame.save_opportunity;}
        if(typeof savedGame.save_proposal_cost!=="undefined") {
            for (i=0;i<savedGame.save_proposal_cost.length;i++) {
                diplomacy.proposal.cost[i]= savedGame.save_proposal_cost[i];
            }
        }
        
        if(typeof savedGame.save_proposal_count!=="undefined") {
            for (i=0;i<savedGame.save_proposal_count.length;i++) {
                diplomacy.proposal.count[i]= savedGame.save_proposal_count[i];
            }
        }

    }
    

}
window.onload = function() {
    load_game();
    document.getElementById("defaultFirst").click();
    display.updateGold();
    display.updateShop();
    display.updatePrayer();
    display.updateMusic(0);
    display.updateWife();
    display.updateUpgrade();
    display.updateStastistic();
    display.updateAchievementRow();
    display.updateAchievement();
    display.updatePrestige1Milestone();
    display.updateBloodline();
    display.updateAutoBuilding();
    display.updatePrestigeT1Confirmation();
    display.updatePrayerThreat();
    //stage 4
    display.updateKingdom();
    display.updateDiplomacy();


}
setInterval(function() {
    save_game();

},3000000)
document.addEventListener("keydown",function(event){
    if( event.ctrlKey && event.code==83) { //ctrl + s
     event.preventDefault();
     save_game();
    }
 }) 
setInterval(function() {
    gold = gold.add(getGPS());
    total_gold = total_gold.add(getGPS());
    wife.stronger_than_you();
    game_prestige_time = game_prestige_time.add(1)
    upgrade.updateUpgradeMulti();
    achievement.check();
    prestigeT1_MS.check();
    bloodline.bondStrengthen();
    prayer.check_danger();
    bloodline.bond_passing_time();
    bloodline.waiting();
    kingdom.update_buildings();
    if (wife.level >=3) {
        diplomacy.all_diplomacy_strengthen();
    };

    

},1000)
setInterval(function() { //display
    display.updateGold();
    display.updateShop();
    display.updateWife();
    display.updatePrayer();
    
    display.updateUpgrade();
    display.updatePlatinum();
    display.updateStastistic();
    display.updateAchievement();
    display.updatePrestige1Milestone();
    display.updateBloodline();
    display.updateAutoBuilding();
    display.updatePrestigeT1Confirmation();
    display.updateKingdom();

    display.updateDiplomacy();
    console.log(prayer.danger);
    

    


},1000)
setInterval(function() {
    game.countdown();
    display.updateTime();
    building.autopurchase();
    kingdom.autopurchasemk2();
    
},10)
