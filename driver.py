import pymem
import time
from flask import json
import requests
from termcolor import colored
pm= ""
hometeam= "MIA"
awayteam = "SA"
try:
    pm = pymem.Pymem('nba2k14.exe')
except pymem.exception.ProcessNotFound:
    error = '[Error] Cannot find nba2k14.exe! \n\tMake sure you have NBA 2K14 open and/or run this program with administrator privilages'
    print(error)
    exit(1)

shotclock = 0
gameclock = 0
homeScore = 0
awayScore = 0
quarter = 0
game_state = []

def gamestate():
    shotclock = pm.read_float(0x1DEE654)
    gameclock = pm.read_float(0x1DEE638)
    homeScore = pm.read_int(0x1DE2188)
    awayScore = pm.read_int(0x1DE260C)
    quarter = pm.read_int(0x1DEE5EC)
    mcpoint = pm.read_int(0x1FFD5B4)
    mcrb = pm.read_int(0x1FFD5B8)
    mcast = pm.read_int(0x1FFD5BC)
    quarterDerived = ""
    gameclockinsecs = pm.read_float(0x1DEE638)
    
    if quarter == 1:
        quarterDerived = "1st"
    elif quarter == 2:
        if quarter == 2 and gameclockinsecs == 0.00000:
            time.sleep(2)
            quarterDerived = "End 1st"
        else:
            quarterDerived = "2nd"
    elif quarter == 3:
        if quarter == 3 and gameclockinsecs == 0.00000:
            time.sleep(2)
            quarterDerived = "Halftime"
        else:
            quarterDerived = "3rd"
    elif quarter == 4:
        if quarter == 4 and gameclockinsecs == 0.00000:
            time.sleep(2)
            quarterDerived = "End 3rd"
        else:
            quarterDerived = "4th"
    elif awayScore == homeScore and quarter > 4 and gameclockinsecs == 0:
            time.sleep(2)
            quarterDerived = "End Reg"
            if quarter > 4 and gameclockinsecs != 0.00000:
                quarterDerived = "OT"
                if awayScore != homeScore and quarter > 4 and gameclockinsecs == 0:
                    quarterDerived = "Final/OT"
    else:
        quarterDerived = "Final"
    if float(gameclockinsecs) > 60:
        gameclock = time.strftime('%M:%S', time.gmtime(int(gameclockinsecs))).lstrip('0')
    else:
        gameclock = "{:.1f}".format(gameclockinsecs)
    if float(shotclock) > 5 and float(gameclockinsecs) >= float(shotclock):
        shotclock = int(shotclock)
    elif float(gameclockinsecs) >= float(shotclock):
        shotclock = "{:.1f}".format(shotclock)
    else:
        shotclock = ""
    game_state = '{"away_team": "'+str(awayteam)+'", "home_team": "'+str(hometeam)+'", "game_clock": "'+str(gameclock)+'", "quarter": "'+str(quarterDerived)+'", "shot_clock": "'+str(shotclock)+'", "awayScore": "'+str(awayScore)+'", "homeScore": "'+str(homeScore)+'", "mcp": "'+str(mcpoint)+'", "rb": "'+str(mcrb)+'", "ast": "'+str(mcast)+'"}'
    return json.loads(str(game_state))

# teamConfigDone = False
# print("Before we start the program, we recommended to state the team names first.\n") 
# while not teamConfigDone:
#     hometeam = input("\n Home team (abv): ")
#     awayteam = input("\n Away team (abv): ")
#     confirm = input("\n Home team: " + hometeam + ", Away team: " + awayteam + "\nIs this correct? (y/n): ")
#     if confirm == 'y':
#         teamConfigDone = True
#     else:
#         continue
        
while True:
    state = gamestate()
    res = requests.post('http://firefly.psl.sat:322/score', json = state)
    if res.status_code == 200:
        time.sleep(0.05)
