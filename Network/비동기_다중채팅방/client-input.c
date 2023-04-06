//클라의 클라이언트
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

#define SERVER "127.0.0.1"
#define PORT 5010
#define BUF_SIZE 256

int main(int argc, char *argv[])
{
	int sock, len;
	struct sockaddr_un sock_addr;
	char buf[BUF_SIZE] = {
		0,
	};

	sock_addr.sun_family = AF_UNIX;

#ifdef C1
	strcpy(sock_addr.sun_path, "./sock_addr1");
#endif
#ifdef C2
	strcpy(sock_addr.sun_path, "./sock_addr2");
#endif
#ifdef C3
	strcpy(sock_addr.sun_path, "./sock_addr3");
#endif
#ifdef C4
	strcpy(sock_addr.sun_path, "./sock_addr4");
#endif

	sock = socket(AF_UNIX, SOCK_STREAM, 0);
	if (sock == -1)
		perror("Socket Error\n");

	if (connect(sock, (struct sockaddr *)&sock_addr, sizeof(sock_addr)) == -1)
	{
		perror("Connet Error\n");
		exit(1);
	}

	while (1)
	{
		printf("> Enter: ");
		fgets(buf, BUF_SIZE, stdin);
		int len = strlen(buf);
		if (buf[len - 1] == '\n')
		{
			buf[len - 1] = '\0';
			len--;
		}

		if (send(sock, buf, BUF_SIZE, 0) == -1)
		{
			perror("Send error\n");
			exit(1);
		}

		if (strncmp(buf, "3", strlen("3")) == 0)
		{
			exit(1);
		}
		memset(buf, 0, BUF_SIZE);
	}

	close(sock);

	return 0;
}