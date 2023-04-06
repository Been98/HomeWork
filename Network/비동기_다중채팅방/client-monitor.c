//클라이언트의 서버
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

#define TIME_SERVER "127.0.0.1"
#define TIME_PORT 5010
#define BUF_SIZE 256

int main(int argc, char *argv[])
{
	int server_c, client, server, len;
	struct sockaddr_un server_addr;	   // unix
	struct sockaddr_in server_addr_in; // inet
	struct sockaddr client_addr;
	char buf[BUF_SIZE] = {0,};
	char buf2[BUF_SIZE] = {
		0,
	};

	server_addr.sun_family = AF_UNIX;

#ifdef C1
	strcpy(server_addr.sun_path, "./sock_addr1");
#endif
#ifdef C2
	strcpy(server_addr.sun_path, "./sock_addr2");
#endif
#ifdef C3
	strcpy(server_addr.sun_path, "./sock_addr3");
#endif
#ifdef C4
	strcpy(server_addr.sun_path, "./sock_addr4");
#endif

	// client input이랑
	server_c = socket(AF_UNIX, SOCK_STREAM, 0);
	if (server_c == -1)
	{
		perror("Server Error\n");
	}

	if (bind(server_c, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1)
	{
		perror("bind");
		exit(1);
	}

	if (listen(server_c, 5) == -1)
	{
		perror("listen");
		exit(1);
	}
	printf("[Info] Unix socket : waiting for conn req\n");
	client = accept(server_c, &client_addr, &len); // 클라이언트 accept
	if (client != -1)
		printf("[Info] Unix socket : client connected\n");
	server_addr_in.sin_family = AF_INET;
	server_addr_in.sin_addr.s_addr = INADDR_ANY;
	server_addr_in.sin_port = htons(TIME_PORT);
	// server랑
	server = socket(AF_INET, SOCK_STREAM, 0);
	if (server == -1)
		perror("Socket Error\n");

	if (connect(server, (struct sockaddr *)&server_addr_in, sizeof(server_addr_in)) == -1)
	{
		perror("Connect Error\n");
		exit(1);
	}
	printf("[Info] Inet socket : connected to the server\n");
	int flags = fcntl(client, F_GETFL, 0);
	fcntl(client, F_SETFL, flags | O_NONBLOCK);

	int flags1 = fcntl(server, F_GETFL, 0);
	fcntl(server, F_SETFL, flags1 | O_NONBLOCK);

	while (1)
	{
		if (recv(client, buf, BUF_SIZE, 0) > 0)
		{									// 내 클라한테 받아
			send(server, buf, BUF_SIZE, 0); // 서버에 보내
			if (strncmp(buf, "3", strlen("3")) == 0)
			{
				exit(1);
			}
		}
		memset(buf, 0, BUF_SIZE);

		if (recv(server, buf2, BUF_SIZE, 0) > 0)
		{ // 내 클라한테 받아
			printf("%s\n", buf2);
		}
		memset(buf2, 0, BUF_SIZE);
	}

	close(server_c);
	close(client);
	close(server);
	return 0;
}