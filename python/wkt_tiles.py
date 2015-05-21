#!/usr/bin/env python
"""This script generate for each tile a WKT with BBOX of the contained files"""
import os, argparse, traceback, time, multiprocessing
from pointcloud import lasops

def argument_parser():
    """ Define the arguments and return the parser object"""
    parser = argparse.ArgumentParser(
    description="Create WKT with extents of files in the tiles")
    parser.add_argument('-i','--input',default='',help='Input folder with the tiles',type=str, required=True)
    parser.add_argument('-o','--output',default='',help='Output folder to dump the WKT files',type=str, required=True)
    parser.add_argument('-c','--proc',default=1,help='Number of processes [default is 1]',type=int)
    return parser


def runProcess(processIndex, tasksQueue, resultsQueue, outputFolder):
    kill_received = False
    while not kill_received:
        tileAbsPath = None
        try:
            # This call will patiently wait until new job is available
            tileAbsPath = tasksQueue.get()
        except:
            # if there is an error we will quit
            kill_received = True
        if tileAbsPath == None:
            # If we receive a None job, it means we can stop
            kill_received = True
        else:
            tFile = open(outputFolder + '/' + os.path.basename(tileAbsPath) + '.wkt', 'w')
            for tilefile in os.listdir(tileAbsPath):
                (_, _, fMinX, fMinY, _, fMaxX, fMaxY, _, _, _, _, _, _, _) = lasops.getPCFileDetails(tileAbsPath + '/' + tilefile)
                tFile.write('POLYGON ((%f %f, %f %f, %f %f, %f %f, %f %f))\n' % (fMinX, fMaxY, fMinX, fMinY, fMaxX, fMinY, fMaxX, fMaxY, fMinX, fMaxY))
            tFile.close()
            resultsQueue.put((processIndex, tileAbsPath)) 

def run(inputFolder, outputFolder, numberProcs):
    # Check input parameters
    if not os.path.isdir(inputFolder):
        raise Exception('Error: Input folder does not exist!')
    if os.path.isfile(outputFolder):
        raise Exception('Error: There is a file with the same name as the output folder. Please, delete it!')
    elif os.path.isdir(outputFolder) and os.listdir(outputFolder):
        raise Exception('Error: Output folder exists and it is not empty. Please, delete the data in the output folder!')  
    
        # Create queues for the distributed processing
    tasksQueue = multiprocessing.Queue() # The queue of tasks (inputFiles)
    resultsQueue = multiprocessing.Queue() # The queue of results
    
    os.system('mkdir -p ' + outputFolder)
    
    tilesNames = os.listdir(inputFolder)
    if 'tiles.js' in tilesNames:
        tilesNames.remove('tiles.js')
    numTiles = len(tilesNames)
    
     # Add tasks/inputFiles
    for i in range(numTiles):
        tasksQueue.put(inputFolder + '/' + tilesNames[i])
    for i in range(numberProcs): #we add as many None jobs as numberProcs to tell them to terminate (queue is FIFO)
        tasksQueue.put(None)
    
    processes = []
    # We start numberProcs users processes
    for i in range(numberProcs):
        processes.append(multiprocessing.Process(target=runProcess, 
            args=(i, tasksQueue, resultsQueue, outputFolder)))
        processes[-1].start()

    # Get all the results (actually we do not need the returned values)
    for i in range(numTiles):
        resultsQueue.get()
        print 'Completed %d of %d (%.02f%%)' % (i+1, numTiles, 100. * float(i+1) / float(numTiles))
    # wait for all users to finish their execution
    for i in range(numberProcs):
        processes[i].join()
        
    
    for tile in os.listdir(inputFolder):
        tFile = open(outputFolder + '/' + tile + '.wkt', 'w')
        for tilefile in os.listdir(inputFolder + '/' + tile):
            (_, _, fMinX, fMinY, _, fMaxX, fMaxY, _, _, _, _, _, _, _) = lasops.getPCFileDetails(inputFolder + '/' + tile + '/' + tilefile)
            tFile.write('POLYGON ((%f %f, %f %f, %f %f, %f %f, %f %f))\n' % (fMinX, fMaxY, fMinX, fMinY, fMaxX, fMinY, fMaxX, fMaxY, fMinX, fMaxY))
        tFile.close()

if __name__ == "__main__":
    args = argument_parser().parse_args()
    print 'Input folder: ', args.input
    print 'Output folder: ', args.output
    print 'Number of processes: ', args.proc
    
    try:
        t0 = time.time()
        print 'Starting ' + os.path.basename(__file__) + '...'
        run(args.input, args.output, args.proc)
        print 'Finished in %.2f seconds' % (time.time() - t0)
    except:
        print 'Execution failed!'
        print traceback.format_exc()
