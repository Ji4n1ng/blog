import re, sys, getopt, os, shutil

def usage():
    print(
"""
------- OldToNew.py Usage -------
--help: show help information
-h or --help: show help information
-s or --source: path of the source files   e.g. path/to/source/
-o or --output: path of the output files   e.g. path/to/output/
-----------------------------------
"""
    )

def gotError(reason):
    print('[Error] ' + reason)
    usage()
    sys.exit()

def log(information):
    print('[Info] ' + information)

def createDirectory(path):
    if not os.path.exists(path):
        os.makedirs(path)

def getAllFileUnderDirectory(path):
    if not os.path.exists(path):
        gotError('path: \' ' + path + '\' not exists')
    files = []
    for (directoryPath, directoryNames, fileNames) in os.walk(path):
        for fileName in fileNames:
            if fileName.startswith('.'):
                continue
            filePath = os.path.join(directoryPath, fileName)
            files.append((fileName, filePath))
        break
    return files


def oldToNew(inputSourcePath, inputOutputPath):
    if not os.path.exists(inputOutputPath):
        gotError('path: \' ' + inputOutputPath + '\' not exists')
    files = getAllFileUnderDirectory(inputSourcePath)
    for _, filePath in files:
        file = open(filePath)
        resultFileDate = ''
        resultData = ''
        for line in file:
            if line.startswith('date: '):
                date = line.split()
                resultFileDate = date[1]
            if line.startswith('thumbnail:'):
                line = line.replace('thumbnail:', 'background:')
            resultData += line
        resultFileRootPath = os.path.join(inputOutputPath, resultFileDate)
        createDirectory(resultFileRootPath)
        resultFilePath = os.path.join(resultFileRootPath, 'index.md')
        resultFile = open(resultFilePath, 'w+')
        resultFile.write(resultData)




    # if inputOutputPath == '':
    #     fileNameWithoutPath = os.path.split(inputSourceFileName)[1]
    #     fileNameWithoutExtension = removeExtension(fileNameWithoutPath)
    #     if '-SignatureBackward' in fileNameWithoutExtension:
    #         inputOutputFileName = fileNameWithoutExtension.split('-SignatureBackward')[0]
    #     else:
    #         inputOutputFileName = fileNameWithoutExtension
    #     inputOutputFileName += '-ResultProcessor.txt'
    
    # inputFile = open(inputSourceFileName)
    # outputFile = open(inputOutputFileName, 'w+')

    # rawResultString = ''
    # isFindUrlInformation = False

    # for line in inputFile:
    #     if 'UNCOVERED Unique set :' in line:
    #         break
    #     if '--url information--' in line:
    #         isFindUrlInformation = True
    #         continue
    #     if isFindUrlInformation:
    #         rawResultString += line + '\n'
    
    # urlPattern = r'URL\[[0-9]+\]\s:\s\w+\s(.*)'
    # matchArray = re.findall(urlPattern, rawResultString)
    # matchSet = set(matchArray)
    # wrongSet = set()

    # index = 0
    # for url in matchSet:
    #     if not 'http' in url:
    #         wrongSet.add(url)
    #     else:
    #         outputFile.write('[' + str(index) + ']:  ' + url + '\n\n')
    #         index += 1
    # outputFile.write('\n\nvalid API count: ' + str(index))
    # outputFile.write('\n\nwrong API count: ' + str(len(wrongSet)))
    # outputFile.write('\n\nwrong API set: \n\n')

    # for i, url in enumerate(wrongSet):
    #     outputFile.write('[' + str(i) + ']:  ' + url + '\n\n')

    
    # outputFile.write('\n\n-------------\n\n')
    # outputFile.write('raw result: ' + str(len(matchArray)) + '\n')
    # for i, url in enumerate(matchArray):
    #     outputFile.write('[' + str(i) + ']:  ' + url + '\n\n')


def main(argv):
    inputSourcePath = ''
    inputOutputPath = ''
    try:
        opts, args = getopt.getopt(argv, "hs:o:", ["help", "source=", "output="])
    except getopt.GetoptError:
        gotError('got error when parsing args')
    for opt, arg in opts:
        if opt in ('-h', '--help'):
            usage()
            sys.exit()
        elif opt in ('-s', '--source'):
            inputSourcePath = arg
        elif opt in ('-o', '--output'):
            inputOutputPath = arg
    oldToNew(inputSourcePath, inputOutputPath)

if len(sys.argv) == 1:
    usage()
    sys.exit(1)

if __name__ == "__main__":
    main(sys.argv[1:])
