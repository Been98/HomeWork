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

#define BUF_SIZE 256
#define SOCK_ADDR "./sock_addr"

int main(int argc, char *argv[])
{
    int sock, len;
    struct sockaddr_un sock_addr;
    char buf[BUF_SIZE] = {0,};

    sock_addr.sun_family = AF_UNIX;
    strcpy(sock_addr.sun_path, SOCK_ADDR);

    sock = socket(AF_UNIX, SOCK_STREAM, 0);
    if (sock == -1)
    {
        perror("Socket Error\n");
    }

    if (connect(sock, (struct sockaddr *)&sock_addr, sizeof(sock_addr)) == -1)
    {
        perror("Commect Error\n");
        exit(1);
    }
    else
        printf("[Info] Unix socket : connected to the server\n");
    while (1)
    {
        printf("> Enter: ");
        fgets(buf,BUF_SIZE,stdin);
	buf[strlen(buf)-1] = '\0';
	send(sock,buf,BUF_SIZE,0);
        if (strncmp(buf, "quit", strlen("quit")) == 0)
        {
	    printf("Terminate...\n");
            break;
        }
        memset(buf, 0, BUF_SIZE);
    }
    printf(": Success\n");
    close(sock);
    printf("[Info] Closing socket\n");
    return 0;
}

