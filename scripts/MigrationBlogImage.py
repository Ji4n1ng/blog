# -*- coding:UTF8 -*-
import re
import sys, os, getopt

def usage():
    print(
"""
------- MigrationBlogImage.py Usage -------
--source or -s [arg]: the path of the source markdown file
[Note] This script accepts only one of the following parameters at a time
--help or -h: show help infomation
--print or -p: print all images
--name or -n [arg]: [arg] is the prefix. change image name to "[arg]-index". change image url according to urls.
"""
    )

urls = [
"https://s2.ax1x.com/2019/04/23/EEGZv9.jpg",
"https://s2.ax1x.com/2019/04/23/EEGACF.jpg",
"https://s2.ax1x.com/2019/04/23/EEG9H0.jpg",
"https://s2.ax1x.com/2019/04/23/EEGpBq.jpg",
"https://s2.ax1x.com/2019/04/23/EEGPEV.jpg",
"https://s2.ax1x.com/2019/04/23/EEGVgJ.png",
"https://s2.ax1x.com/2019/04/23/EEGF4U.jpg",
"https://s2.ax1x.com/2019/04/23/EEGiNT.png",
"https://s2.ax1x.com/2019/04/23/EEGmuR.gif",
]

def gotError(reason):
    print(reason)
    sys.exit()

def log(info):
    print('[Info] ' + info)

def log_e(reason):
    print('[Error] ' + reason)

def log_ex(reason):
    log_e(reason)
    sys.exit()

def checkPathExists(path):
    if not os.path.exists(path):
        log_ex('path: \'' + path + '\' not exists')

index = 0
prefix = ''

findImgAllRE = r'(?:!\[(.*?)\]\((.*?)\))' # ![ $0 ]( $1 )
findImgNameRE = r'(?:!\[(.*?)\]\(.*\))' # ![ $0 ]()
findImgUrlRE = r'(?:!\[.*\]\((.*?)\))'  # ![]( $0 )

allPattern = re.compile(findImgAllRE)
imgPattern = re.compile(findImgNameRE)
urlPattern = re.compile(findImgUrlRE)

def printAllImages(filePath):
	checkPathExists(filePath)
	fileText = open(filePath).read()
	pattern = re.compile(findImgAllRE)
	result = pattern.findall(fileText)
	for r in result:
		print(r[0] + ' ' + r[1])
	print('\n images.count: ' + str(len(result)))
	print('\n urls.count: ' + str(len(urls)))

def imageName(matched):
	global index
	global prefix
	wholeMatched = matched.group(0)
	name = prefix + '-' + str(index + 1)
	index += 1
	return wholeMatched.replace(matched.group(1), name)

def url(matched):
	global index
	global urls
	wholeMatched = matched.group(0)
	url = urls[index]
	index += 1
	return wholeMatched.replace(matched.group(1), url)

def changeNameAndUrl(filePath, prefix):
	global index
	checkPathExists(filePath)
	fileText = open(filePath).read()
	index = 0
	result1 = re.sub(findImgNameRE, imageName, fileText)

	index = 0
	result2 = re.sub(findImgUrlRE, url, result1)

	resultFile = open('index.md', 'w')
	resultFile.write(result2)

def main(argv):
	inputMarkdownFilePath = ''
	global prefix
	isPrint = False
	try:
		opts, args = getopt.getopt(argv, "hs:n:p", ["help", "source=", "name=", "print"])
	except getopt.GetoptError:
		log_ex('got error when parsing args')
	for opt, arg in opts:
		if opt in ('-h', '--help'):
			usage()
			sys.exit()
		elif opt in ('-s', '--source'):
			log('source file: ' + arg)
			inputMarkdownFilePath = arg
		elif opt in ('-p', '--print'):
			log('print all images')
			isPrint = True
		elif opt in ('-n', '--name'):
			log('name prefix: ' + arg)
			prefix = arg
	if isPrint:
		printAllImages(inputMarkdownFilePath)
	else:
		changeNameAndUrl(inputMarkdownFilePath, prefix)

if __name__ == "__main__":
    main(sys.argv[1:])
