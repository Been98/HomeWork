//서버
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <string.h>
#include <netinet/in.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/un.h>
#include <fcntl.h>
#include <arpa/inet.h>
#include <sys/select.h>
#include <sys/time.h>
#include <pthread.h>
#include <signal.h>

#define BUF_SIZE 256
#define TIME_SERVER "127.0.0.1"
#define TIME_PORT 5010
#define CHAT_MENU "<MENU>\n 1.Chatroom list\n 2.Participate in the chat room (Usage: 2 <Chat room number>)\n 3.Exit Program\n(0 to display the menu again)\n"

int maxArr(int arr[], int n);
void handler(int sig);
void *thread_func(void *arg);
void send_msg(char *buf, int *arr, int size, int num);
void shiftArr(int *arr, int *size, int value);
void exit_thread(int sig);

struct ChatRoom
{
	int user[15];	//채팅방에 참여한 user id
	int id;			//채팅방의 id
	int count_user; // User수
};

int waitingUser[15]; // 대기방
int waitingNum = 0;	 // 대기 중인
struct ChatRoom chatRoom[3];
pthread_t p_thread[3];
int server, client[15], len;
int main(int argc, char *argv[])
{

	int ret, userCnt = 0;
	struct sockaddr_in server_addr_in; // inet
	struct sockaddr client_addr;
	char buf[BUF_SIZE] = {
		0,
	};

	struct timeval time;
	int threadNum[3] = {0, 1, 2};

	fd_set readfds;

	server_addr_in.sin_family = AF_INET;
	server_addr_in.sin_addr.s_addr = INADDR_ANY;
	server_addr_in.sin_port = htons(TIME_PORT);

	signal(SIGINT, handler);

	// 스레드 생성
	for (int i = 0; i < 3; i++)
	{
		pthread_create(&p_thread[i], NULL, thread_func, (void *)&threadNum[i]);
	}

	server = socket(AF_INET, SOCK_STREAM, 0);
	if (server == -1)
	{
		perror("Server Error\n");
		exit(1);
	}
	if (bind(server, (struct sockaddr *)&server_addr_in, sizeof(server_addr_in)) == -1)
	{
		perror("bind");
		exit(1);
	}
	if (listen(server, 5) == -1)
	{
		perror("listen");
		exit(1);
	}

	int flags = fcntl(server, F_GETFL, 0);
	fcntl(server, F_SETFL, flags | O_NONBLOCK);

	while (1)
	{
		client[userCnt] = accept(server, &client_addr, &len);
		if (client[userCnt] > 0)
		{
			send(client[userCnt], CHAT_MENU, BUF_SIZE, 0); // 메뉴 출력

			// 대기실 입장
			waitingUser[waitingNum] = client[userCnt];
			printf("[MAIN] A new user has accessed : %d\n", waitingUser[waitingNum]);
			waitingNum++;
			userCnt++;
		}

		FD_ZERO(&readfds);

		for (int i = 0; i < waitingNum; i++)
		{
			FD_SET(waitingUser[i], &readfds);
		}

		time.tv_sec = 1;
		time.tv_usec = 1000;

		int max = maxArr(waitingUser, waitingNum);
		ret = select(max + 1, &readfds, NULL, NULL, &time);
		if (ret == -1 || ret == 0)
			continue;
		for (int i = 0; i < max + 1; i++)
		{

			if (FD_ISSET(i, &readfds))
			{
				int length = recv(i, buf, BUF_SIZE, 0);
				buf[length] = 0;
				printf("[MAIN] Message from user %d : %s\n", i, buf);
				switch (buf[0])
				{
				case '0': // 메뉴 전송
					send(i, CHAT_MENU, BUF_SIZE, 0);
					break;
				case '1': // 채팅방 상태
					strcpy(buf, "<ChatRoom info>\n");
					for (int j = 0; j < 3; j++)
					{
						sprintf(buf, "%s[ID: %d] Chatroom-%d (%d/5)\n", buf, j, j, chatRoom[j].count_user);
					}
					send(i, buf, BUF_SIZE, 0);
					break;
				case '2': // 입장
					int numRoom = buf[2] - '0';

					chatRoom[numRoom].user[chatRoom[numRoom].count_user] = i;
					chatRoom[numRoom].count_user++;

					printf("[MAIN] User %d  participates in chat room %d.\n", i, numRoom);
					printf("[Ch.[%d] A new participant : %d\n", numRoom, i);

					FD_CLR(i, &readfds);

					shiftArr(waitingUser, &waitingNum, i);
					break;
				case '3': // 퇴장
					printf("[MAIN] User %d leaves the chat room \n", i);
					FD_CLR(i, &readfds);
					shiftArr(waitingUser, &waitingNum, i);
					close(i);
					break;
				}
			}
		}
	}
}

void *thread_func(void *ChatInfo)
{
	fd_set readfds;
	struct timeval time;
	char buf[BUF_SIZE];
	char buf2[BUF_SIZE];
	int ret;

	int numRoom = *((int *)ChatInfo);
	int *temp = (int *)ChatInfo;

	FD_ZERO(&readfds);

	while (1)
	{
		signal(SIGUSR1, exit_thread);
		time.tv_sec = 1;
		time.tv_usec = 1000;
		for (int i = 0; i < chatRoom[numRoom].count_user; i++)
		{
			FD_SET(chatRoom[numRoom].user[i], &readfds);
		}
		ret = select(maxArr(chatRoom[numRoom].user, chatRoom[numRoom].count_user) + 1, &readfds, NULL, NULL, &time);
		if (ret == -1 || ret == 0)
			continue;
		for (int i = 0; i < chatRoom[numRoom].count_user; i++)
		{
			if (FD_ISSET(chatRoom[numRoom].user[i], &readfds))
			{
				int length = recv(chatRoom[numRoom].user[i], buf, BUF_SIZE, 0);
				buf[length] = 0;
				printf("[Ch.%d] Message from user %d : %s\n", numRoom, chatRoom[numRoom].user[i], buf);
				sprintf(buf2, "[%d] : %s", chatRoom[numRoom].user[i], buf);
				if (chatRoom[numRoom].count_user == 1)
				{
					printf("[Ch.%d] User %d is alone\n", numRoom, chatRoom[numRoom].user[i]);
				}
				else
				{
					sprintf(buf2, "[ME] : %s", buf);
					send(chatRoom[numRoom].user[i], buf2, BUF_SIZE, 0);
					sprintf(buf2, "[%d] : %s", chatRoom[numRoom].user[i], buf);
					send_msg(buf2, chatRoom[numRoom].user, chatRoom[numRoom].count_user, i);
				}
				if (strcmp(buf, "quit") == 0)
				{
					printf("User %d)Exit chat room\n", chatRoom[numRoom].user[i]);
					waitingUser[waitingNum] = chatRoom[numRoom].user[i];
					waitingNum++;
					shiftArr(chatRoom[numRoom].user, &chatRoom[numRoom].count_user, chatRoom[numRoom].user[i]);
				}
			}
		}
	}
}
void shiftArr(int *arr, int *size, int value)
{
	int a = -1;
	for (int i = 0; i < *size; i++)
	{
		if (arr[i] == value)
			a = i;
	}
	for (int i = a; i < *size - 1; i++)
	{
		arr[i] = arr[i + 1];
	}
	(*size)--;
}
int maxArr(int arr[], int n)
{
	int max = 0;
	for (int j = 0; j < n; j++)
		if (max < arr[j])
			max = arr[j];
	return max;
}
void send_msg(char *buf, int *arr, int size, int num)
{
	for (int i = 0; i < num; i++)
	{
		send(arr[i], buf, BUF_SIZE, 0);
	}
	for (int i = size - 1; i > num; i--)
	{
		send(arr[i], buf, BUF_SIZE, 0);
	}
}
void handler(int sig)
{
	printf("(Signal Handler) Start finishing operation!\n");
	for (int i = 0; i < 3; i++)
	{
		pthread_kill(p_thread[i], SIGUSR1);
		pthread_join(p_thread[i], 0);
	}
	printf("Complete ! Bye~\n");
	close(server);
	exit(0);
}
void exit_thread(int sig)
{
	pthread_exit(0);
}
